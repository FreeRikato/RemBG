import "reflect-metadata";
import { EventEmitter } from "events";

class IORedisMock extends EventEmitter {
    constructor() {
        super();
        process.nextTick(() => this.emit("ready"));
    }

    get status() {
        return "ready";
    }

    get = jest.fn().mockResolvedValue(null);
    set = jest.fn().mockResolvedValue("OK");
    del = jest.fn().mockResolvedValue(1);
    quit = jest.fn().mockResolvedValue("OK");
    disconnect = jest.fn().mockResolvedValue("OK");
}

jest.mock("ioredis", () => {
    return {
        __esModule: true,
        default: IORedisMock,
        Redis: IORedisMock,
    };
});

jest.mock("bullmq", () => ({
    ...jest.requireActual("bullmq"),
    Queue: jest.fn().mockImplementation(() => ({
        add: jest.fn().mockResolvedValue({ id: "mock-job-id" }),
        getJob: jest.fn().mockResolvedValue(null),
    })),
}));

jest.mock("./data-source", () => ({
    AppDataSource: {
        getRepository: jest.fn(() => ({
            findOneBy: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            delete: jest.fn(),
            find: jest.fn(),
        })),
        initialize: jest.fn().mockResolvedValue(null),
        destroy: jest.fn().mockResolvedValue(null),
    },
}));

console.log(
    "Global test setup: ioredis, bullmq.Queue, and AppDataSource have been mocked.",
);
