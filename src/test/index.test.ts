/* eslint-disable @typescript-eslint/no-unused-expressions */
import { expect } from 'chai';
import { strict as assert } from 'node:assert';
import { ApolloServer } from '@apollo/server';
import { resolvers } from '../resolvers.js';
import { typeDefs } from '../typeDefs.js';
import { type Movie, movies as originalMovies } from '../data/all-data-typed.js';

describe('Apollo Server Movies test suite', () => {
	let testServer: ApolloServer<any>;

	beforeEach(() => {
		testServer = new ApolloServer({
			typeDefs,
			resolvers,
		});
	});

	describe('Read tests', () => {
		it('should run a basic Apollo test', async () => {
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

	describe('Add tests', () => {
		let testMovie = {
			title: 'The Rock',
			year: 1996,
			directors: 'Michael Bay',
			writers: [
				'Jonathan Hensleigh', 'Douglas S. Cook', 'Mark Rosner', 'David Weisberg',
			],
			rating: 4,
			genres: [
				'action', 'silly', 'prison', 'bayhem', 'military',
			],
		};

		it('should add a movie', async () => {
			const response = await testServer.executeOperation({
				query: `mutation AddMovie($movie: NewMovie!) {
					addMovie(movie: $movie) {
						id
						title
					}
				}`,
				variables: { movie: testMovie },
			});

			// The asserts tell TypeScript to narrow the types asserted
			assert(response.body.kind === 'single');
			assert(response.body.singleResult.data);
			assert(response.body.singleResult.data.addMovie);
			let addedMovie = response.body.singleResult.data.addMovie as Partial<Movie>;
			expect(addedMovie.id).to.be.greaterThan(1);
		});

		it('should add a retrievable movie', async () => {
			const response = await testServer.executeOperation({
				query: `mutation AddMovie($movie: NewMovie!) {
					addMovie(movie: $movie) {
						id
						title
					}
				}`,
				variables: { movie: testMovie },
			});

			// The asserts tell TypeScript to narrow the types asserted
			assert(response.body.kind === 'single');
			assert(response.body.singleResult.data);
			assert(response.body.singleResult.data.addMovie);
			let addedMovie = response.body.singleResult.data.addMovie as Partial<Movie>;

			const testResponse = await testServer.executeOperation({
				query: `query($id: Int) {
					movies(id: $id) {
						id
						title
						year
					}
				}`,
				variables: { id: addedMovie.id },
			});

			assert(testResponse.body.kind === 'single');
			assert(testResponse.body.singleResult.data);
			assert(testResponse.body.singleResult.data.movies);
			let actualMovies = testResponse.body.singleResult.data.movies as Movie[];
			assert.equal(actualMovies.length, 1);
		});
	});
});
