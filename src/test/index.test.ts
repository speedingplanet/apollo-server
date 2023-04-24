/* eslint-disable @typescript-eslint/no-unused-expressions */
import { expect } from 'chai';
import { strict as assert } from 'node:assert';
import { ApolloServer } from '@apollo/server';
import { resolvers } from '../resolvers.js';
import { typeDefs } from '../typeDefs.js';
import { type Movie, movies as originalMovies } from '../data/all-data-typed.js';

describe('Test suite', () => {
	let testServer: ApolloServer<any>;

	beforeEach(() => {
		testServer = new ApolloServer({
			typeDefs,
			resolvers,
		});
	});

	it('should run a basic test', () => {
		expect(1 + 1).to.equal(2);
	});

	it('should run a basic apollo test', async () => {
		const response = await testServer.executeOperation({
			query: 'query SayHelloWorld($name: String) { hello(name: $name) }',
			variables: { name: 'world' },
		});

		assert(response.body.kind === 'single');
		expect(response.body.singleResult.errors).to.be.undefined;
	});

	it('should retrieve a list of movies', async () => {
		const response = await testServer.executeOperation({
			query: 'query { movies{id} }',
		});

		// The asserts tell TypeScript to narrow the types asserted
		assert(response.body.kind === 'single');
		assert(response.body.singleResult.data);
		assert(response.body.singleResult.data.movies);
		assert(Array.isArray(response.body.singleResult.data.movies));
		expect(response.body.singleResult.data.movies.length).to.equal(originalMovies.length);
	});

	it('should filter on a single-value field', async () => {
		let testYear = 2001;

		const response = await testServer.executeOperation({
			query: `query($year: Int) {
				movies(year: $year) {
					id
					title
					year
				}
			}`,
			variables: { year: testYear },
		});

		assert(response.body.kind === 'single');
		assert(response.body.singleResult.data);
		assert(response.body.singleResult.data.movies);
		assert(Array.isArray(response.body.singleResult.data.movies));
		let actualMovies = response.body.singleResult.data.movies as Movie[];
		expect(actualMovies.length).to.be.greaterThan(0);
		assert(actualMovies.every(m => m.year === testYear));
	});

	it('should filter on multiple single-value fields', async () => {
		let testYear = 2001;
		let testTitle = 'Spirited Away';

		const response = await testServer.executeOperation({
			query: `query($title: String, $year: Int) {
				movies(title: $title, year: $year) {
					id
					title
					year
				}
			}`,
			variables: {
				year: testYear,
				title: testTitle,
			},
		});

		assert(response.body.kind === 'single');
		assert(response.body.singleResult.data);
		assert(response.body.singleResult.data.movies);
		assert(Array.isArray(response.body.singleResult.data.movies));
		let actualMovies = response.body.singleResult.data.movies as Movie[];
		expect(actualMovies.length).to.be.greaterThan(0);
		actualMovies.forEach(m => {
			// Write them this way to get better feedback on failure
			assert.equal(m.year, testYear);
			assert.equal(m.title, testTitle);
		});
	});

	it('should filter on a single value in a multiple-value field', async () => {
		let testGenre = 'drama';

		const response = await testServer.executeOperation({
			query: `query($genre: String) {
				movies(genre: $genre) {
					id
					genres
				}
			}`,
			variables: {
				genre: testGenre,
			},
		});

		assert(response.body.kind === 'single');
		assert(response.body.singleResult.data);
		assert(response.body.singleResult.data.movies);
		assert(Array.isArray(response.body.singleResult.data.movies));
		let actualMovies = response.body.singleResult.data.movies as Movie[];
		expect(actualMovies.length).to.be.greaterThan(0);
		actualMovies.forEach(m => {
			// Write them this way to get better feedback on failure
			expect(m.genres).to.contain(testGenre);
		});
	});
});
