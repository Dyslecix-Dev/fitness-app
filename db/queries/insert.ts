// TODO: Replace example file

import { db } from "@/db/index";
import { InsertPost, InsertUser, postsTable, usersTable } from "@/db/schema";

export async function createUser(data: InsertUser) {
  await db.insert(usersTable).values(data);
}

export async function createPost(data: InsertPost) {
  await db.insert(postsTable).values(data);
}
