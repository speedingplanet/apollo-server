/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import type { Resolvers } from './generated/graphql.ts';
import { type Movie, movies } from './data/all-data-typed.js';
import _ from 'lodash';

let singularFields = [
	'id', 'title', 'rating', 'year',
];

let multipleFields = [
	'directors', 'writers', 'genres',
];

export const resolvers: Resolvers = {
	Query: {
		hello: (_, { name }: { name: string }) => `Hello ${name}!`,

		movies(parent, args) {
			if (!args || _.isEmpty(args)) return movies;

			let filteredMovies: Movie[] = [];
			let argKeys = Object.keys(args);
			if (argKeys.some(k => singularFields.includes(k))) {
				let singularArgs = _.pick(args, singularFields);

				// TypeScript thinks _filter could return Movie or number, I don't know why
				filteredMovies = _.filter(movies, singularArgs) as Movie[];
			}

			if (argKeys.some(k => multipleFields.includes(`${k}s`))) {
				let multipleArgs = _.pick(args, multipleFields);

				filteredMovies = filteredMovies.filter(m => {
					return Object.entries(multipleArgs)
						.every(([searchKey, searchValue]) => {
							return m[searchKey] === searchValue;
						});
				});
			}
			return filteredMovies;
		},
	},
};
