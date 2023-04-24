/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { movies, students } from './data/all-data-typed.js';

export const resolvers = {
	Query: {
		hello: (_, { name }: { name: string }) => `Hello ${name}!`,

		movies(parent, args) {
			if (args.year) {
				return	movies.filter(m => m.year === args.year);
			} else {
				return movies;
			}
		},

		moviesByYear(parent, args) {
			// Whatever
			if (args.year) {
				return	movies.filter(m => m.year === args.year);
			} else {
				return movies;
			}
		},

		students(/* parent, args, contextValue, info */) {
			return students;
		},
	},
};
