/* eslint-disable no-underscore-dangle */
const NewThread = require('../../Domains/threads/entities/NewThread');
const AddedThread = require('../../Domains/threads/entities/AddedThread');

class AddThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(addThreadUseCasePayload) {
    const newThread = new NewThread(addThreadUseCasePayload);
    const addedThread = await this._threadRepository.addThread(newThread);
    return new AddedThread(addedThread);
  }
}

module.exports = AddThreadUseCase;
