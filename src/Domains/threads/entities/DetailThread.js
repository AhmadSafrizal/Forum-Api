/* eslint-disable class-methods-use-this */
/* eslint-disable no-underscore-dangle */
class DetailThread {
  constructor(payload) {
    this._verifyPayload(payload);

    const {
      id, username, date, content, is_delete: isDelete,
    } = payload;

    this.id = id;
    this.username = username;
    this.date = date.toISOString();
    this.content = (isDelete) ? '**komentar telah dihapus**' : content;
  }

  _verifyPayload(payload) {
    const {
      id, username, date, content, is_delete: isDelete,
    } = payload;

    if (!id || !username || !date || !content) {
      throw new Error('DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof username !== 'string' || typeof content !== 'string' || typeof isDelete !== 'boolean') {
      throw new Error('DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = DetailThread;
