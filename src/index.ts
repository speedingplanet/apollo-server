import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { movies, students } from './data/all-data-typed.js';

export const resolvers = {
	Query: {
		movies(/* parent, args, contextValue, info */) {
			return movies;
		},

		students(/* parent, args, contextValue, info */) {
			return students;
		},
	},
};

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = readFileSync(resolve('./schema.graphql'), { encoding: 'utf-8' });

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
	typeDefs,
	resolvers,
});

// Passing an ApolloServer instance to the `startStandaloneServer` function:
//  1. creates an Express app
//  2. installs your ApolloServer instance as middleware
//  3. prepares your app to handle incoming requests
const { url } = await startStandaloneServer(server, {
	listen: { port: 4000 },
});

console.log(`🚀  Server ready at: ${url}`);
