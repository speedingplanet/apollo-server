/* eslint-disable @typescript-eslint/no-unused-expressions */
import { expect } from 'chai';
import { strict as assert } from 'node:assert';
import { ApolloServer } from '@apollo/server';
import { resolvers } from '../resolvers.ts';
import { typeDefs } from '../typeDefs.ts';
import { movies as originalMovies } from '../data/all-data-typed.ts';

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

		// THe asserts tell TypeScript to narrow the types asserted
		assert(response.body.kind === 'single');
		assert(response.body.singleResult.data);
		assert(response.body.singleResult.data.movies);
		assert(Array.isArray(response.body.singleResult.data.movies));
		expect(response.body.singleResult.data.movies.length).to.equal(originalMovies.length);
	});
});
