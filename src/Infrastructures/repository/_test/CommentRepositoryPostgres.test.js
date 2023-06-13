/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const CommentTableTestHelper = require('../../../../tests/CommentTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NewComment = require('../../../Domains/comments/entities/NewComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const NewThread = require('../../../Domains/threads/entities/NewThread');
const pool = require('../../database/postgres/pool');

describe('CommentRepositoryPostgres', () => {
  it('should be instance of CommentRepository domain', () => {
    const commentRepositoryPostgres = new CommentRepositoryPostgres({}, {}); // dummy dependency

    expect(commentRepositoryPostgres).toBeInstanceOf(CommentRepository);
  });

  describe('behavior test', () => {
    afterEach(async () => {
      await CommentTableTestHelper.cleanTable();
      await ThreadTableTestHelper.cleanTable();
      await UsersTableTestHelper.cleanTable();
    });

    afterAll(async () => {
      await pool.end();
    });

    describe('addComment', () => {
      it('should persist new comment and return added comment correctly', async () => {
        // Arrange
        const newComment = new NewComment({
          content: 'this is comment',
          threadId: 'thread-123',
          owner: 'user-123',
        });

        const fakeIdGenerator = () => '123'; // stub!
        const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

        // Action
        const addedComment = await commentRepositoryPostgres
          .addComment(newComment);
        const comment = await CommentTableTestHelper.getCommentById(addedComment.id);

        // Assert
        expect(addedComment).toStrictEqual(new AddedComment({
          id: 'comment-123',
          content: newComment.content,
          owner: newComment.owner,
        }));
        expect(comment).toHaveLength(1);
        expect(comment[0].is_deleted).toEqual(false);
      });
      // it('should throw NotFoundError when thread not found', async () => {
      //   // Arrange
      //   const newComment = new NewComment({ content: 'this is comment' });
      //   const fakeIdGenerator = () => '123'; // stub!
      //   const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      //   // Action & Assert
      //   await expect(commentRepositoryPostgres.addComment(newComment, 'thread-123', 'user-123'))
      //     .rejects
      //     .toThrowError(NotFoundError);
      // });
    });

    describe('verifyAvailableCommentInThread function', () => {
      it('should throw NotFoundError when thread is not available', async () => {
        const commentRepositoryPostgres = new CommentRepositoryPostgres(
          pool,
          {},
          {},
        );

        await expect(
          commentRepositoryPostgres.verifyAvailableCommentInThread('thread-123', 'comment-123'),
        ).rejects.toThrowError(NotFoundError);
      });

      it('should throw NotFoundError when comment is not available', async () => {
        // await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
        const commentRepositoryPostgres = new CommentRepositoryPostgres(
          pool,
          {},
          {},
        );

        await expect(
          commentRepositoryPostgres.verifyAvailableCommentInThread('thread-123', 'comment-123'),
        ).rejects.toThrowError(NotFoundError);
      });

      it('should not throw NotFoundError when thread and comment are available', async () => {
        await CommentTableTestHelper.addComment({
          id: 'comment-123',
          content: 'first comment',
          date: new Date('2023-04-13T00:00:00.000Z'),
        });

        const commentRepositoryPostgres = new CommentRepositoryPostgres(
          pool,
          {},
          {},
        );

        await expect(
          commentRepositoryPostgres.verifyAvailableCommentInThread(
            'comment-123',
            'thread-123',
          ),
        ).resolves.not.toThrowError(NotFoundError);
      });
    });

    describe('verifyCommentAccess', () => {
      it('should throw NotFoundError when comment not found', async () => {
        // Arrange
        const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

        // Action & Assert
        await expect(commentRepositoryPostgres.verifyCommentAccess('comment-123', 'user-789'))
          .rejects
          .toThrowError(NotFoundError);
      });

      it('should throw AuthorizationError when credentialId not match owner column', async () => {
        // Arrange
        await UsersTableTestHelper.addUser({ id: 'user-123' });
        await ThreadTableTestHelper.addThread({
          id: 'thread-123',
          owner: 'user-123',
        });
        await CommentTableTestHelper.addComment({
          id: 'comment-123',
          threadId: 'thread-123',
          owner: 'user-123',
        });
        const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

        // Action & Assert
        await expect(commentRepositoryPostgres.verifyCommentAccess('comment-123', 'user-789'))
          .rejects
          .toThrowError(AuthorizationError);
      });

      it('should not throw AuthorizationError or NotFoundError when credentialId match owner column', async () => {
        // Arrange
        await UsersTableTestHelper.addUser({ id: 'user-123' });
        await ThreadTableTestHelper.addThread({
          id: 'thread-123',
          owner: 'user-123',
        });
        await CommentTableTestHelper.addComment({
          id: 'comment-123',
          threadId: 'thread-123',
          owner: 'user-123',
        });
        const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

        // Action & Assert
        await expect(commentRepositoryPostgres.verifyCommentAccess('comment-123', 'user-123'))
          .resolves.not.toThrow(NotFoundError);
        await expect(commentRepositoryPostgres.verifyCommentAccess('comment-123', 'user-123'))
          .resolves.not.toThrow(AuthorizationError);
      });
    });

    describe('deleteCommentByCommentId', () => {
      it('should throw NotFoundError when comment not found', async () => {
        // Arrange
        const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

        // Action & Assert
        await expect(commentRepositoryPostgres.deleteCommentByCommentId('comment-123'))
          .rejects
          .toThrowError(NotFoundError);
      });

      it('should return success and update is_delete column correctly', async () => {
        // Arrange
        await UsersTableTestHelper.addUser({ id: 'user-123' });
        await ThreadTableTestHelper.addThread({
          id: 'thread-123',
          owner: 'user-123',
        });
        await CommentTableTestHelper.addComment({
          id: 'comment-123',
          threadId: 'thread-123',
          owner: 'user-123',
        });
        const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

        // Action
        const result = await commentRepositoryPostgres.deleteCommentByCommentId('comment-123');

        // Assert
        const comment = await CommentTableTestHelper.getCommentById('comment-123');
        expect(result.status).toEqual('success');
        expect(comment[0].id).toEqual('comment-123');
        expect(comment[0].is_deleted).toEqual(true);
      });
    });
  });
});
