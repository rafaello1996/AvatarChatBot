import { intent } from './intent';
import { entity } from './entity';

export class WitResponse{
    intents: intent[];
    entities: entity;
    traits: Object[];
}