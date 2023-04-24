/* eslint-disable @typescript-eslint/no-unused-expressions */
import { expect } from 'chai';
import { strict as assert } from 'node:assert';
import { ApolloServer } from '@apollo/server';
import { resolvers } from '../resolvers.ts';
import { typeDefs } from '../typeDefs.ts';

describe('Test suite', () => {
	it('should run a basic test', () => {
		expect(1 + 1).to.equal(2);
	});

	it('should run a basic apollo test', async () => {
		const testServer = new ApolloServer({
			typeDefs,
			resolvers,
		});

		const response = await testServer.executeOperation({
			query: 'query SayHelloWorld($name: String) { hello(name: $name) }',
			variables: { name: 'world' },
		});

		assert(response.body.kind === 'single');
		expect(response.body.singleResult.errors).to.be.undefined;
	});

	it('should retrieve a list of movies', async () => {
		const testServer = new ApolloServer({
			typeDefs,
			resolvers,
		});

		const response = await testServer.executeOperation({
			query: 'query SayHelloWorld($name: String) { hello(name: $name) }',
			variables: { name: 'world' },
		});

		expect(response.body.kind).to.equal('single');
		assert;
	});
});
