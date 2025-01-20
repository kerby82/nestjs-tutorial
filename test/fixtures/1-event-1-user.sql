INSERT INTO
    "user" (
        "id",
        "username",
        "password",
        "email",
        "firstName",
        "lastName",
        "profileId"
    )
VALUES
    (
        DEFAULT,
        'e2e-test',
        '$2b$10$5v5ZIVbPGXf0126yUiiys.z/POxSaus.iSbzXj7cTRW9KWGy5bfcq',
        'e2e@test.com',
        'End',
        'To End',
        NULL
    );

INSERT INTO
    "events" (
        "id",
        "description",
        "when",
        "address",
        "name",
        "organizerId"
    )
VALUES
    (
        DEFAULT,
        'That is a crazy event, must go there!',
        '2021-04-15 21:00:00',
        'Local St 101',
        'Interesting Party',
        (SELECT "id" FROM "user" WHERE "username" = 'e2e-test')
    );