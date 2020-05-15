import React from "react";
import axios from "../axios";
import FriendButton from "./FriendButton.js";
import { render, waitForElement, act } from "@testing-library/react";

jest.mock("../axios.js");

test("Makes AJaX request and displays correct for no request.", async () => {
    axios.get.mockClear().mockResolvedValue({
        data: { status: "no-request" },
    });

    let container;
    await act(async () => {
        container = render(<FriendButton id={2} />).container;
    });

    expect(axios.get.mock.calls.length).toBe(1);
    expect(container.innerHTML).toContain("Friends?");
});

test("Existing request should be cancelable.", async () => {
    axios.get.mockClear().mockResolvedValue({
        data: { status: "request-made-by-myself" },
    });

    let container;
    await act(async () => {
        container = render(<FriendButton id={2} />).container;
    });

    await waitForElement(() => container.querySelector("#friendRequest"));

    expect(container.innerHTML).toContain("Cancel");
});

test("Accepted requests should be removable (unfriend).", async () => {
    axios.get.mockClear().mockResolvedValue({
        data: { status: "request-accepted" },
    });

    let container;
    await act(async () => {
        container = render(<FriendButton id={2} />).container;
    });

    await waitForElement(() => container.querySelector("#friendRequest"));
    expect(container.innerHTML).toContain("Over? <s>Friends</s>");
});

test("Request TO me should be acceptable.", async () => {
    axios.get.mockClear().mockResolvedValue({
        data: { status: "request-made-by-other" },
    });

    let container;
    await act(async () => {
        container = render(<FriendButton id={1} />).container;
    });

    await waitForElement(() => container.querySelector("#friendRequest"));
    expect(container.innerHTML).toContain("Accept");
});