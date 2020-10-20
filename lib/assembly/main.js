"use strict";
/*
 * This is an example of an AssemblyScript smart contract with two simple,
 * symmetric functions:
 *
 * 1. setGreeting: accepts a greeting, such as "howdy", and records it for the
 *    user (account_id) who sent the request
 * 2. getGreeting: accepts an account_id and returns the greeting saved for it,
 *    defaulting to "Hello"
 *
 * Learn more about writing NEAR smart contracts with AssemblyScript:
 * https://docs.near.org/docs/roles/developer/contracts/assemblyscript
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.setGreeting = exports.getGreeting = void 0;
const near_sdk_as_1 = require("near-sdk-as");
const DEFAULT_MESSAGE = "Hello";
// Exported functions will be part of the public interface for your smart contract.
// Feel free to extract behavior to non-exported functions!
function getGreeting(accountId) {
    // This uses raw `storage.get`, a low-level way to interact with on-chain
    // storage for simple contracts.
    // If you have something more complex, check out persistent collections:
    // https://docs.near.org/docs/roles/developer/contracts/assemblyscript#imports
    return near_sdk_as_1.storage.get(accountId, DEFAULT_MESSAGE);
}
exports.getGreeting = getGreeting;
function setGreeting(message) {
    const account_id = near_sdk_as_1.Context.sender;
    // Use logging.log to record logs permanently to the blockchain!
    near_sdk_as_1.logging.log(
    // String interpolation (`like ${this}`) is a work in progress:
    // https://github.com/AssemblyScript/assemblyscript/pull/1115
    'Saving greeting "' + message + '" for account "' + account_id + '"');
    near_sdk_as_1.storage.set(account_id, message);
}
exports.setGreeting = setGreeting;
