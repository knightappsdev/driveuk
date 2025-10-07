import { NextRequest } from 'next/server';
import { fetchAllUsers, mapUsersWithName, checkUserExists, createNewUser } from './lib/database';
import { handleApiError, createSuccessResponse, createErrorResponse } from './lib/responses';
import { CreateUserRequest } from './lib/types';

export async function GET() {
  try {
    const allUsers = await fetchAllUsers();
    const usersWithName = mapUsersWithName(allUsers);

    return createSuccessResponse(usersWithName);
  } catch (error) {
    return handleApiError(error, 'fetch users');
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateUserRequest = await request.json();
    const { email, firstName, lastName, phone, role, city } = body;

    // Check if user already exists
    const userExists = await checkUserExists(email);
    
    if (userExists) {
      return createErrorResponse('User with this email already exists');
    }

    // Create new user
    const newUser = await createNewUser({
      email,
      firstName,
      lastName,
      phone,
      role,
      city,
    });
    
    return createSuccessResponse(newUser, 201);
  } catch (error) {
    return handleApiError(error, 'create user');
  }
}