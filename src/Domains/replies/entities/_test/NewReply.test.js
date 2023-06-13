/* eslint-disable no-undef */
const NewReply = require('../NewReply');

describe('NewReply entities', () => {
  it('should have throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      content: 'this is reply',
    };

    // Action and Assert
    expect(() => new NewReply(payload)).toThrowError('NEW_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should have throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      commentId: 123,
      content: 123,
      owner: 'user-123',
    };

    // Action and Assert
    expect(() => new NewReply(payload)).toThrowError('NEW_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create NewReply object correctly', () => {
    // Arrange
    const payload = {
      commentId: 'comment-123',
      content: 'this is reply',
      owner: 'user-123',
    };

    // Action
    const {
      commentId, content, owner,
    } = new NewReply(payload);
    // Assert
    expect(commentId).toEqual(payload.commentId);
    expect(content).toEqual(payload.content);
    expect(owner).toEqual(payload.owner);
  });
});
