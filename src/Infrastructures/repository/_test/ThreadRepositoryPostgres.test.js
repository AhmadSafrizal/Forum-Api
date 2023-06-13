/* eslint-disable no-undef */
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const CommentTableTestHelper = require('../../../../tests/CommentTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const NewThread = require('../../../Domains/threads/entities/NewThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const pool = require('../../database/postgres/pool');

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addThread function', () => {
    it('should persist new thread amd return thread correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        username: 'user-123',
        password: 'password-123',
      });
      const newThread = new NewThread({
        title: 'thread',
        body: 'this is thread',
        owner: 'user-123',
      });

      const fakeIdGenerator = () => '000';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedThread = await threadRepositoryPostgres.addThread(newThread);

      // Assert
      const threads = await ThreadTableTestHelper.findThreadById('thread-000');
      expect(addedThread).toStrictEqual(
        new AddedThread({
          id: 'thread-000',
          title: 'thread',
          owner: 'user-123',
        }),
      );
      expect(threads).toHaveLength(1);
    });

    it('should return added thread corectly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        username: 'user-123',
        password: 'password-123',
      });
      const newThreadPayload = {
        title: 'thread',
        body: 'this is thread',
        owner: 'user-123',
      };
      const newThread = new NewThread(newThreadPayload);

      const fakeIdGenerator = () => '000';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedThread = await threadRepositoryPostgres.addThread(newThread);

      // Assert
      expect(addedThread).toStrictEqual(
        new AddedThread({
          id: 'thread-000',
          title: 'thread',
          owner: 'user-123',
        }),
      );
    });
  });

  describe('getThreadById function', () => {
    it('should throw NotFoundError when thread not found', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadRepositoryPostgres.getThreadById('thread-1')).rejects.toThrowError(NotFoundError);
    });

    it('should return thread correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        username: 'user-123',
        password: 'password-123',
      });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      await ThreadTableTestHelper.addThread({
        id: 'thread-123',
      });

      // Action
      const thread = await threadRepositoryPostgres.getThreadById('thread-123');

      // Assert
      expect(thread).toStrictEqual({
        id: 'thread-123',
        title: 'thread',
        body: 'this is thread',
        date: new Date('2023-04-05T00:00:00.000Z'),
        username: 'user-123',
      });
    });
  });

  describe('verifyAvailableThread function', () => {
    it('should throw NotFoundError when thread not found', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadRepositoryPostgres.verifyAvailableThread('thread-1')).rejects.toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when thread found', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        username: 'user-123',
        password: 'password-123',
      });

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      await ThreadTableTestHelper.addThread({ id: 'thread-123' });

      // Action & Assert
      await expect(threadRepositoryPostgres.verifyAvailableThread('thread-123')).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('getRepliesByThreadId function', () => {
    it('should return replies correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        username: 'user-123',
        password: 'password-123',
      });
      await ThreadTableTestHelper.addThread({ id: 'thread-123' });
      await CommentTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123' });
      await RepliesTableTestHelper.addReply({ id: 'reply-123', commentId: 'comment-123' });

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action
      const replies = await threadRepositoryPostgres.getRepliesByThreadId('thread-123');

      // Assert
      expect(replies).toHaveLength(1);
      expect(replies[0]).toStrictEqual({
        id: 'reply-123',
        comment_id: 'comment-123',
        username: 'user-123',
        date: new Date('2023-04-05T00:00:00.000Z'),
        content: 'this is reply',
        owner: 'user-123',
        is_deleted: false,
      });
    });
  });
});
