/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { type Resolvers } from './generated/graphql.ts';
import { movies, students } from './data/all-data-typed.js';

export const resolvers: Resolvers = {
	Query: {
		hello: (_, { name }: { name: string }) => `Hello ${name}!`,

		movies(parent, args) {
			if (args.title) {
				return	movies.filter(m => m.title === args.title);
			} else {
				return movies;
			}
		},
	},
};
