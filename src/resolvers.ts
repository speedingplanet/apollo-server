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
