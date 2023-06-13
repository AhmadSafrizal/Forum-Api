/* eslint-disable no-undef */
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const NewThread = require('../../../Domains/threads/entities/NewThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddThreadUseCase = require('../AddThreadUseCase');

describe('AddThreadUseCase', () => {
  it('should orchestrating add thread action correctly', async () => {
    // Arrange
    const addThreadUseCasePayload = {
      title: 'thread',
      body: 'this is thread',
      owner: 'user-123',
    };

    const expectAddedThread = new AddedThread({
      id: 'thread-123',
      title: addThreadUseCasePayload.title,
      body: addThreadUseCasePayload.body,
      date: '2023-04-05T09:58:40.000Z',
      owner: addThreadUseCasePayload.owner,
    });

    // creating dependency of use case
    const mockThreadRepository = new ThreadRepository();

    // mocking needed function
    mockThreadRepository.addThread = jest.fn().mockImplementation(() => Promise.resolve(
      new AddedThread({
        id: 'thread-123',
        title: addThreadUseCasePayload.title,
        body: addThreadUseCasePayload.body,
        date: '2023-04-05T09:58:40.000Z',
        owner: addThreadUseCasePayload.owner,
      }),
    ));

    const addThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const addedThread = await addThreadUseCase.execute(addThreadUseCasePayload);

    // Assert
    expect(addedThread).toStrictEqual(expectAddedThread);
    expect(mockThreadRepository.addThread).toBeCalledWith(
      new NewThread({
        title: addThreadUseCasePayload.title,
        body: addThreadUseCasePayload.body,
        owner: addThreadUseCasePayload.owner,
      }),
    );
  });
});
