/* eslint-disable camelcase */
/* eslint-disable max-len */
/* eslint-disable no-undef */
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const GetThreadByIdUseCase = require('../GetThreadByIdUseCase');

describe('GetThreadUseCase', () => {
  it('should orchestrating get thread action correctly', async () => {
    // Arrange
    const getThreadUseCasePayload = {
      threadId: 'thread-123',
    };

    const expectThread = {
      id: 'thread-123',
      title: 'thread',
      body: 'this is thread',
      date: '2023',
      username: 'user-123',
    };

    const expectComments = [
      {
        id: 'comment-123',
        username: 'user-123',
        date: '2023',
        content: 'this is comment',
        is_deleted: false,
      },
    ];

    const expectReplies = [
      {
        id: 'reply-123',
        username: 'user-123',
        date: '2023',
        content: 'this is comment',
        comment_id: 'comment-123',
        is_deleted: false,
      },
    ];

    const mappedComments = expectComments.map(({ is_deleted: deleteComment, ...otherProperties }) => otherProperties);
    const mappedReplies = expectReplies.map(({ comment_id, is_deleted, ...otherProperties }) => otherProperties);

    const expectCommentsAndReplies = [
      {
        ...mappedComments[0],
        replies: mappedReplies,
      },
    ];

    // creating dependency of use case
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    // mocking needed function
    mockThreadRepository.getThreadById = jest.fn().mockImplementation(() => Promise.resolve(expectThread));
    mockCommentRepository.getCommentByThreadId = jest.fn().mockImplementation(() => Promise.resolve(expectComments));
    mockThreadRepository.getRepliesByThreadId = jest.fn().mockImplementation(() => Promise.resolve(expectReplies));

    const mockGetThreadUseCase = new GetThreadByIdUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    const getThread = await mockGetThreadUseCase.execute(getThreadUseCasePayload.threadId);

    // Assert
    expect(getThread).toStrictEqual({
      ...expectThread,
      comments: expectCommentsAndReplies,
    });
    expect(mockThreadRepository.getThreadById).toBeCalledWith(getThreadUseCasePayload.threadId);
    expect(mockCommentRepository.getCommentByThreadId).toBeCalledWith(getThreadUseCasePayload.threadId);
    expect(mockThreadRepository.getRepliesByThreadId).toBeCalledWith(getThreadUseCasePayload.threadId);
  });

  it('should not display deleted comment', async () => {
    // Arrange
    const getThreadUseCasePayload = {
      threadId: 'thread-123',
    };

    const expectThread = {
      id: 'thread-123',
      title: 'thread',
      body: 'this is thread',
      date: '2023',
      username: 'user-123',
    };

    const expectComments = [
      {
        id: 'comment-123',
        username: 'user-123',
        date: '2023',
        content: '**comment deleted**',
        is_deleted: true,
      },
    ];

    const expectReplies = [
      {
        id: 'reply-123',
        username: 'user-123',
        date: '2023',
        content: '**reply deleted**',
        comment_id: 'comment-123',
        is_deleted: true,
      },
    ];

    const mappedComments = expectComments.map(({ is_deleted: deleteComment, ...otherProperties }) => otherProperties);
    const mappedReplies = expectReplies.map(({ comment_id, is_deleted, ...otherProperties }) => otherProperties);

    const expectCommentsAndReplies = [
      {
        ...mappedComments[0],
        replies: mappedReplies,
      },
    ];

    // creating dependency of use case
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    // mocking needed function
    mockThreadRepository.getThreadById = jest.fn().mockImplementation(() => Promise.resolve(expectThread));
    mockCommentRepository.getCommentByThreadId = jest.fn().mockImplementation(() => Promise.resolve(expectComments));
    mockThreadRepository.getRepliesByThreadId = jest.fn().mockImplementation(() => Promise.resolve(expectReplies));

    const mockGetThreadUseCase = new GetThreadByIdUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    const getThread = await mockGetThreadUseCase.execute(getThreadUseCasePayload.threadId);

    // Assert
    expect(getThread).toStrictEqual({
      ...expectThread,
      comments: expectCommentsAndReplies,
    });
    expect(mockThreadRepository.getThreadById).toBeCalledWith(getThreadUseCasePayload.threadId);
    expect(mockCommentRepository.getCommentByThreadId).toBeCalledWith(getThreadUseCasePayload.threadId);
    expect(mockThreadRepository.getRepliesByThreadId).toBeCalledWith(getThreadUseCasePayload.threadId);
  });
});
