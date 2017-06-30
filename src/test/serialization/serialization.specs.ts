import * as assert from 'assert';
import { serialization } from '../../index';


describe('Serialization', () => {
    it('Pattern 1', () => {
        let pattern = {
            properties: [
                'id',
                'name',
                { 'engineId': 'engine.id' },
                { 'engineCode': 'engine.code' }
            ]
        };
        serialization.check(pattern);
        let excepted = {
            properties: [
                { key: 'id', value: 'id' },
                { key: 'name', value: 'name' },
                { key: 'engineId', value: 'engine.id' },
                { key: 'engineCode', value: 'engine.code' }
            ]

        };
        assert.deepEqual(pattern, excepted);

    });

    it('Pattern 2', () => {
        let pattern = {
            properties: [
                'name',
                'engine.code'
            ]
        };
        serialization.check(pattern);
        let excepted = {
            properties: [
                { key: 'name', value: 'name' },
                { key: 'code', value: 'engine.code' },
                { key: 'id', value: 'id' }
            ]

        };
        assert.deepEqual(pattern, excepted);

    });
    it('Pattern 3', () => {
        let pattern = {
            properties: [
                'name',
                {
                    'engineInfo': 'engine',
                    'properties': [
                        'id',
                        'code'
                    ]
                }
            ]
        };
        serialization.check(pattern);
        let excepted = {
            properties: [
                { key: 'name', value: 'name' },
                {
                    key: 'engineInfo',
                    value: 'engine',
                    properties: [
                        { key: 'id', value: 'id' },
                        { key: 'code', value: 'code' }
                    ]

                },
                { key: 'id', value: 'id' }
            ]

        };
        assert.deepEqual(pattern, excepted);

    });

    it('Pattern 4', () => {
        const pattern = {
            properties: [
                'name',
                {
                    engine: 'engine',
                    $ref: '#/definitions/engine'
                }
            ],
            definitions: {
                engine: {
                    properties: [
                        'id',
                        'code'
                    ]
                }
            }
        };
        serialization.check(pattern);
        const excepted = {
            properties: [
                { key: 'name', value: 'name' },
                {
                    key: 'engine',
                    value: 'engine',
                    properties: [
                        { key: 'id', value: 'id' },
                        { key: 'code', value: 'code' }
                    ]

                },
                { key: 'id', value: 'id' }
            ],
            definitions: {
                engine: {
                    properties: [
                        'id',
                        'code'
                    ]
                }
            }

        };
        assert.deepEqual(pattern, excepted);

    });

    it('Pattern 5', () => {
        const pattern = {
            properties: [
                'name',
                {
                    leafs: 'leafs',
                    $ref: '#/definitions/tree'
                }
            ],
            definitions: {
                tree: {
                    properties: [
                        'name',
                        {
                            leafs: 'leafs',
                            $ref: '#/definitions/tree'
                        }
                    ]
                }
            }
        };
        serialization.check(pattern);
        const excepted = {
            properties: [
                { key: 'name', value: 'name' },
                {
                    key: 'leafs',
                    value: 'leafs',
                    properties: [
                        { key: 'name', value: 'name' },
                        {
                            key: 'leafs',
                            value: 'leafs',
                            $ref: '#/definitions/tree'
                        },
                        { key: 'id', value: 'id' }
                    ]
                },
                { key: 'id', value: 'id' }
            ],
            definitions: {
                tree: {
                    properties: [
                        'name',
                        {
                            leafs: 'leafs',
                            $ref: '#/definitions/tree'
                        }
                    ]
                }
            }

        };
        assert.deepEqual(pattern, excepted);

    });

    it('Pattern 6', () => {
        const pattern = {
            allOf: [
                { '$ref': '#/definitions/tree' }
            ],
            definitions: {
                tree: {
                    properties: [
                        'name',
                        {
                            leafs: 'leafs',
                            $ref: '#/definitions/tree'
                        }
                    ]
                }
            }
        };
        serialization.check(pattern);
        const excepted = {
            properties: [
                { key: 'name', value: 'name' },
                {
                    key: 'leafs',
                    value: 'leafs',
                    properties: [
                        { key: 'name', value: 'name' },
                        {
                            key: 'leafs',
                            value: 'leafs',
                            $ref: '#/definitions/tree'
                        },
                        { key: 'id', value: 'id' }
                    ]
                },
                { key: 'id', value: 'id' }
            ],
            definitions: {
                tree: {
                    properties: [
                        'name',
                        {
                            leafs: 'leafs',
                            $ref: '#/definitions/tree'
                        }
                    ]
                }
            }

        };
        assert.deepEqual(pattern, excepted);

    });

    it('Pattern 7', () => {
        const pattern = {
            properties: [
                'id',
                {
                    engine: 'engine',
                    $ref: '#/definitions/engine'
                }
            ],
            definitions: {
                engine: {
                    properties: [
                        'id',
                        {
                            manufacturer: 'manufacturer',
                            $ref: '#/definitions/manufacturer'
                        }

                    ]
                },
                manufacturer: {
                    properties: [
                        'id',
                        'name'
                    ]
                }
            }
        };
        serialization.check(pattern);
        const excepted = {
            properties: [
                { key: 'id', value: 'id' },
                {
                    key: 'engine',
                    value: 'engine',
                    properties: [
                        { key: 'id', value: 'id' },
                        {
                            key: 'manufacturer',
                            value: 'manufacturer',
                            properties: [
                                { key: 'id', value: 'id' },
                                { key: 'name', value: 'name' }
                            ]
                        }
                    ]

                }
            ],
            definitions: {
                engine: {
                    properties: [
                        'id',
                        {
                            manufacturer: 'manufacturer',
                            $ref: '#/definitions/manufacturer'
                        }

                    ]
                },
                manufacturer: {
                    properties: [
                        'id',
                        'name'
                    ]
                }
            }

        };
        assert.deepEqual(pattern, excepted);

    });



});


