/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import type { Resolvers } from './generated/graphql.js';
import {
	type Movie, movies, students, type Student
} from './data/all-data-typed.js';
import _ from 'lodash';
import { GraphQLError } from 'graphql';

let singularFields = [
	'id', 'title', 'rating', 'year',
];

let multipleFields = [
	'director', 'writer', 'genre',
];

export const resolvers: Resolvers = {
	Query: {
		hello: (_, { name }: { name: string }) => `Hello ${name}!`,

		movies(parent, args) {
			if (!args || _.isEmpty(args)) return movies;

			let filteredMovies: Movie[] = [...movies];
			let argKeys = Object.keys(args);
			if (argKeys.some(k => singularFields.includes(k))) {
				let singularArgs = _.pick(args, singularFields);

				// TODO: TypeScript thinks _filter could return Movie or number, I don't know why
				filteredMovies = _.filter(movies, singularArgs) as Movie[];
			}

			if (argKeys.some(k => multipleFields.includes(k))) {
				let multipleArgs = _.pick(args, multipleFields);

				filteredMovies = filteredMovies.filter(m => {
					return Object.entries(multipleArgs)
						.every(([searchKey, searchValue]) => {
							return m[`${searchKey}s`].includes(searchValue);
						});
				});
			}
			return filteredMovies;
		},

		students(parent, args) {
			if (!args || _.isEmpty(args)) return students;

			let filteredStudents: Student[] = [...students];
			filteredStudents = _.filter(students, args) as Student[];
			return filteredStudents;
		},
	},

	Mutation: {
		addMovie(parent, args) {
			let id = getNextId(movies, 'id');
			let newMovie = {
				...args.movie,
				id,
			};

			movies.push(newMovie);

			return newMovie;
		},

		addStudent(parent, args) {
			let id = getNextId(movies, 'id');
			let newStudent = {
				...args.student,
				id,
			};

			// TODO: Some complexity with province: null on the TS side and
			// and optional province on the GraphQL side
			students.push(newStudent as Student);

			return newStudent;
		},

		updateMovie(parent, args) {
			let id = args.id;

			let foundMovie = movies.find(m => m.id === id);
			if (foundMovie === null || typeof foundMovie !== 'object') {
				throw new GraphQLError(`Invalid argument value (id ${id} not found`, {
					extensions: { code: 'BAD_USER_INPUT' },
				});
			} else {
				Object.assign(foundMovie, args.movie);
			}

			return foundMovie;
		},

		updateStudent(parent, args) {
			let id = args.id;

			let foundStudent = students.find(m => m.id === id);
			if (foundStudent === null || typeof foundStudent !== 'object') {
				throw new GraphQLError(`Invalid argument value (id ${id} not found`, {
					extensions: { code: 'BAD_USER_INPUT' },
				});
			} else {
				Object.assign(foundStudent, args.student);
			}

			return foundStudent;
		},

		deleteMovie(parent, args) {
			let id = args.id;

			let foundMovieIndex = movies.findIndex(m => m.id === id);
			if (foundMovieIndex === -1) {
				throw new GraphQLError(`Invalid argument value (id ${id} not found`, {
					extensions: { code: 'BAD_USER_INPUT' },
				});
			} else {
				movies.splice(foundMovieIndex, 1);
			}
			return true;
		},

		deleteStudent(parent, args) {
			let id = args.id;

			let foundStudentIndex = students.findIndex(m => m.id === id);
			if (foundStudentIndex === -1) {
				throw new GraphQLError(`Invalid argument value (id ${id} not found`, {
					extensions: { code: 'BAD_USER_INPUT' },
				});
			} else {
				students.splice(foundStudentIndex, 1);
			}
			return true;
		},
	},
};

function getNextId<T>(records: T[], field: keyof T) {
	let values = records.map(r => r[field]) as number[];
	return Math.max(...values) + 1;
}
