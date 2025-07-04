# Konvo Social Media Features Implementation

This document explains the three new functionalities implemented in the Konvo social media application.

## Features Overview

### F-V1: User's Own Posts
**Description**: Users can view their own posts in reverse chronological order (most recent first), with timestamps and like counts.

**API Endpoint**: `GET /api/posts/my-posts`
**Frontend**: Available in the "My Posts" tab in the main feed
**Features**:
- Displays up to 20 most recent posts
- Shows timestamps for each post
- Displays like counts for each post
- Reverse chronological order (newest first)

### F-V2: Followed User's Posts
**Description**: Users can view posts of one specific followed user, with timestamps and like counts.

**API Endpoint**: `GET /api/posts/user/{userId}/posts`
**Frontend**: Available when viewing a specific user's profile
**Features**:
- Only accessible if the current user is following the target user
- Displays up to 20 most recent posts from the followed user
- Shows timestamps for each post
- Displays like counts for each post
- Reverse chronological order (newest first)
- Error handling for non-followed users

### F-V3: Aggregated Timeline
**Description**: Users can view an aggregated timeline of posts from all followed users.

**API Endpoint**: `GET /api/posts/timeline`
**Frontend**: Available in the "Timeline" tab in the main feed
**Features**:
- Displays up to 20 most recent posts from all followed users
- Shows user information and timestamps for each post
- Displays like counts for each post
- Reverse chronological order (newest first)
- Aggregated view of all followed users' content

## How to Navigate to User Profiles

### Method 1: From Post Cards
- **Click on the user's avatar** in any post card
- **Click on the user's name or username** in any post card
- This will navigate to `/profile/{userId}` and show their posts

### Method 2: From Search Results
- Use the search bar in the right sidebar
- Click on any user in the search results
- This will navigate to their profile and show their posts

### Method 3: From Navigation Menu
- Click on "Profile" in the left navigation menu
- This will show your own profile and posts

### Method 4: Direct URL
- Navigate directly to `/profile/{userId}` where `{userId}` is the user's ID

## Profile View Features

When viewing any user's profile, you can see:
- **Profile Information**: Name, username, bio, location, birth date
- **Follow/Following Counts**: Number of followers and following
- **Posts Section**: 
  - For your own profile: Shows your 20 most recent posts and reposts (same as "My Posts" section)
  - For other users: Shows their 20 most recent posts with timestamps and like counts
- **Follow Button**: Follow/unfollow the user (if not your own profile)

## Technical Implementation

### Backend Changes

1. **New Controller Endpoints** (`PostController.java`):
   - `getMyPosts()` - F-V1 implementation
   - `getFollowedUserPosts()` - F-V2 implementation (strict follow requirement)
   - `getUserProfilePosts()` - Profile viewing (no follow requirement)
   - `getTimeline()` - F-V3 implementation

2. **New Service Methods** (`PostService.java` & `PostServiceImplementation.java`):
   - `getUserOwnPosts()` - Retrieves user's own posts
   - `getFollowedUserPosts()` - Retrieves specific followed user's posts (strict)
   - `getUserProfilePosts()` - Retrieves any user's posts (permissive)
   - `getTimeline()` - Retrieves aggregated timeline

3. **New Repository Queries** (`PostRepository.java`):
   - `findUserOwnPostsOrderByCreatedAtDesc()` - F-V1 query
   - `findUserPostsOrderByCreatedAtDesc()` - F-V2 & Profile query
   - `findPostsFromFollowedUsersOrderByCreatedAtDesc()` - F-V3 query

### Frontend Changes

1. **New Redux Actions** (`Action.jsx`):
   - `getMyPosts()` - F-V1 action
   - `getFollowedUserPosts(userId)` - F-V2 action (strict)
   - `getUserProfilePosts(userId)` - Profile viewing action (permissive)
   - `getTimeline()` - F-V3 action

2. **New Action Types** (`ActionType.jsx`):
   - Added action types for all three functionalities

3. **Updated Reducer** (`Reducer.jsx`):
   - Added cases for handling new actions

4. **New Components**:
   - `PostSection.jsx` - Main component with tabs for different post views
   - `UserPostsSection.jsx` - Component for viewing specific user posts
   - Updated `Profile.jsx` - Now includes posts section with tabs

5. **Navigation Updates**:
   - Clickable user avatars and names in post cards
   - Clickable user search results
   - Profile navigation from menu

## Usage Instructions

### For Users:

1. **View Your Own Posts**:
   - Navigate to the main feed
   - Click on the "My Posts" tab
   - View your 20 most recent posts with timestamps and like counts

2. **View Any User's Profile**:
   - Click on a user's avatar or name in any post
   - Use the search bar to find users
   - Navigate directly to `/profile/{userId}`
   - View their posts, profile info, and follow/unfollow them

3. **View Followed User's Posts (F-V2)**:
   - Follow a user first
   - Navigate to their profile
   - View their posts with timestamps and like counts

4. **View Timeline**:
   - Navigate to the main feed
   - Click on the "Timeline" tab
   - View aggregated posts from all users you follow

### For Developers:

1. **API Testing**:
   ```bash
   # F-V1: Get user's own posts
   GET /api/posts/my-posts
   Authorization: Bearer <jwt_token>

   # F-V2: Get specific followed user's posts (strict)
   GET /api/posts/user/{userId}/posts
   Authorization: Bearer <jwt_token>

   # Profile viewing: Get any user's posts (permissive)
   GET /api/posts/user/{userId}/profile-posts
   Authorization: Bearer <jwt_token>

   # F-V3: Get timeline
   GET /api/posts/timeline
   Authorization: Bearer <jwt_token>
   ```

2. **Frontend Integration**:
   ```javascript
   // Dispatch actions to load different post types
   dispatch(getMyPosts());
   dispatch(getFollowedUserPosts(userId)); // Strict follow requirement
   dispatch(getUserProfilePosts(userId));  // No follow requirement
   dispatch(getTimeline());
   ```

## Data Structure

Each post in the response includes:
- `id`: Post identifier
- `content`: Post text content
- `image`: Post image URL (if any)
- `video`: Post video URL (if any)
- `user`: User information (id, username, image, etc.)
- `createdAt`: Timestamp when post was created
- `totalLikes`: Number of likes on the post
- `totalReplies`: Number of replies to the post
- `totalRePosts`: Number of reposts of the post
- `isLiked`: Whether the current user has liked this post
- `isReposted`: Whether the current user has reposted this post

## Error Handling

- **Authentication**: All endpoints require valid JWT token
- **Authorization**: F-V2 requires the user to be following the target user
- **Profile Viewing**: No follow requirement for general profile viewing
- **Pagination**: All endpoints limit results to 20 most recent posts
- **User Validation**: Proper error messages for invalid user IDs or non-existent users

## Performance Considerations

- All queries use database indexes on `createdAt` for efficient sorting
- Results are limited to 20 posts to ensure fast loading
- Follow relationships are checked efficiently using database joins
- Like counts are calculated from the database, not computed on-the-fly 