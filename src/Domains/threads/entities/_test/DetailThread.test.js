/* eslint-disable no-undef */
const DetailThread = require('../DetailThread');

describe('DetailThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'user123',
      date: new Date('2023-06-20 19:00:19.000000'),
    };

    // Action and Assert
    expect(() => new DetailThread(payload)).toThrowError('DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data specification', () => {
    // Arrange
    const payload = {
      id: 'Comment-123',
      username: 123,
      date: '9392380138',
      content: 'Cont',
      is_delete: 12455,
    };

    // Action and Assert
    expect(() => new DetailThread(payload)).toThrowError('DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create DetailThread entities correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'user123',
      date: new Date('2023-06-20 19:00:00.000000'),
      content: 'Cont',
      is_delete: true,
    };

    // Action
    const threadComment = new DetailThread(payload);

    // Assert
    expect(threadComment.id).toEqual(payload.id);
    expect(threadComment.date).toEqual(payload.date.toISOString());
    expect(threadComment.username).toEqual(payload.username);
    expect(threadComment.content).toEqual('**komentar telah dihapus**');
  });
});
