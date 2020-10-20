"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const main_1 = require("../main");
const near_sdk_as_1 = require("near-sdk-as");
describe("Greeting ", () => {
    it("should be set and read", () => {
        main_1.setGreeting("hello world");
        const greeting = near_sdk_as_1.storage.get(near_sdk_as_1.Context.sender);
    });
});
