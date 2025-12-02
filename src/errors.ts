export class badRequestError extends Error {
    constructor(message: string) {
        super(message);
    }
};

export class unauthorizedError extends Error {
    constructor(message: string) {
        super(message);
    }
};

export class paymentRequiredError extends Error {
    constructor(message: string) {
        super(message);
    }
};

export class forbiddenError extends Error {
    constructor(message: string) {
        super(message);
    }
};
