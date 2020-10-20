import BN from 'bn.js';
import { PublicKey } from '../node_modules/near-api-js/src/utils/key_pair';
import { Assignable } from '../node_modules/near-api-js/src/utils/enums';
export declare class IAction extends Assignable {
}
declare class RewardFeeFraction extends Assignable {
    'numerator': number;
    'denominator': number;
}
export declare class Account extends Assignable {
    'unstaked': BN;
    'stake_shares': BN;
    'unstaked_available_epoch_height': number;
}
export declare class AccountsMap extends Assignable {
    'deprecated': number;
    'key_index_prefix': Uint8Array;
    'keys': AccountsMapKeys;
    'values': AccountsMapValues;
}
export declare class AccountsMapKeys extends Assignable {
    'len': number;
    'prefix': Uint8Array;
}
export declare class AccountsMapValues extends Assignable {
    'len': number;
    'prefix': Uint8Array;
}
export declare class StakingContract extends Assignable {
    'owner_id': string;
    'stake_public_key': PublicKey;
    'last_epoch_height': number;
    'total_stake_shares': BN;
    'last_total_balance': BN;
    'total_staked_balance': BN;
    'reward_fee_fraction': RewardFeeFraction;
    'accounts': AccountsMap;
    'paused': boolean;
}
export declare class AccountHash extends Assignable {
    'hash': Uint8Array;
}
export declare const SCHEMA: Map<Function, any>;
export declare const ACCOUNT: Map<Function, any>;
export declare const ACCOUNTHASH: Map<Function, any>;
export declare function deserializeData(data: any): any;
export declare function decodeAccountHash(class_type: any, data: any): any;
export declare function decodeAccount(class_type: any, data: any): any;
export declare function readBigUInt64LE(buffer: any, offset?: number): bigint;
export {};
