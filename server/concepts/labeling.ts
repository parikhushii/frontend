import { ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";
import { NotAllowedError, NotFoundError } from "./errors";

export interface LabelingDoc extends BaseDoc {
  owner: ObjectId;
  name: string;
  item: ObjectId;
}

/**
 * Concepts Labeling[Authenticating.User, Requesting.Activity]
 * Labels apply to three types of data: 1. other users (Circles), 2. activities (Favorites, Wishlist), 3. time blocks (Free, Hard Commitment, Soft Commitment)
 */
export default class LabelingConcept {
  public readonly labels: DocCollection<LabelingDoc>;
  /**
   * Make an instance of Labeling.
   */
  constructor(instanceName: string) {
    this.labels = new DocCollection<LabelingDoc>(instanceName);
  }

  async addLabel(owner: ObjectId, name: string, item: ObjectId) {
    const _id = await this.labels.createOne({ owner, name, item });
    return { msg: "Label created successfully!", label: await this.labels.readOne(_id) };
  }

  async changeLabel(_id: ObjectId, name: string) {
    await this.labels.partialUpdateOne({ _id }, { name });
    return { msg: "Label updated successfully!" };
  }

  async deleteLabel(_id: ObjectId) {
    await this.labels.deleteOne({ _id });
    return { msg: "Label removed successfully!" };
  }

  async getAllItemsWithLabel(owner: ObjectId, name: string) {
    return await this.labels.readMany({ owner, name });
  }

  async getLabelsOnItem(owner: ObjectId, item: ObjectId) {
    return await this.labels.readMany({ owner, item });
  }

  async assertOwnerIsUser(_id: ObjectId, user: ObjectId) {
    const label = await this.labels.readOne({ _id });
    if (!label) {
      throw new NotFoundError(`Label ${_id} does not exist!`);
    }
    if (label.owner.toString() !== user.toString()) {
      throw new UserOwnerNotMatchError(user, _id);
    }
  }

  // Only Collecting will need this
  async assertNotAlreadyLabeled(owner: ObjectId, item: ObjectId) {
    if ((await this.getLabelsOnItem(owner, item)).length !== 0) {
      throw new NotAllowedError(`Item ${item} is already labeled. Remove the label to proceed.`);
    }
  }

  async assertAlreadyLabeled(owner: ObjectId, item: ObjectId) {
    if ((await this.getLabelsOnItem(owner, item)).length === 0) {
      throw new NotAllowedError(`Item ${item} has no label.`);
    }
  }

  async assertGoodName(name: string, forbidden: string[] = []) {
    if (name in forbidden) {
      throw new NotAllowedError(`Name ${name} is forbidden.`);
    }
  }
}

export class UserOwnerNotMatchError extends NotAllowedError {
  constructor(
    public readonly user: ObjectId,
    public readonly _id: ObjectId,
  ) {
    super("{0} is not the owner of label {1}!", user, _id);
  }
}
