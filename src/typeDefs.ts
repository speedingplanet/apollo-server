import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

export const typeDefs = readFileSync(resolve('./schema.graphql'), { encoding: 'utf-8' });
