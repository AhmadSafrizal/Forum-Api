/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-vars */
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AddedComment = require('../../Domains/comments/entities/AddedComment');
const CommentRepository = require('../../Domains/comments/CommentRepository');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(newComment) {
    const { content, threadId, owner } = newComment;
    const id = `comment-${this._idGenerator()}`;
    const date = new Date().toISOString();
    const isDelete = false;

    // const queryThread = {
    //   text: 'SELECT * FROM threads WHERE id = $1',
    //   values: [threadId],
    // };
    // const resultThread = await this._pool.query(queryThread);
    // if (!resultThread.rowCount) {
    //   throw new NotFoundError('tidak bisa menambah komentar: thread tidak ditemukan');
    // }

    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5,$6) RETURNING id, content, owner',
      values: [id, threadId, owner, content, date, isDelete],
    };

    const result = await this._pool.query(query);

    return new AddedComment({ ...result.rows[0] });
  }

  async verifyAvailableCommentInThread(commentId, threadId) {
    const query = {
      text: 'SELECT 1 FROM comments WHERE id = $1 AND thread_id = $2',
      values: [commentId, threadId],
    };

    const { rowCount } = await this._pool.query(query);

    if (!rowCount) {
      throw new NotFoundError('Komentar pada thread ini tidak ditemukan');
    }

    return rowCount;
  }

  async verifyCommentAccess(commentId, credentialId) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [commentId],
    };
    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('comment tidak ditemukan');
    }
    const comment = result.rows[0];
    if (comment.owner !== credentialId) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }

  async deleteCommentByCommentId(commentId) {
    const query = {
      text: 'UPDATE comments set is_deleted=true WHERE id = $1',
      values: [commentId],
    };
    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('comment tidak ditemukan');
    }

    return { status: 'success' };
  }
}

module.exports = CommentRepositoryPostgres;
