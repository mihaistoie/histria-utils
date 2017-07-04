import * as assert from 'assert';
import { serialization, schemaManager } from '../../index';

const
    CAR_SCHEMA = {
        type: 'object',
        name: 'car',
        nameSpace: 'compositions',
        properties: {
            name: {
                type: 'string'
            },
            id: {
                type: 'integer',
                generated: true,
                format: 'id'
            }

        },
        relations: {
            engine: {
                type: 'hasOne',
                model: 'engine',
                aggregationKind: 'composite',
                invRel: 'car',
                nameSpace: 'compositions',
                title: 'engine',
                invType: 'belongsTo',
                localFields: [
                    'id'
                ],
                foreignFields: [
                    'carId'
                ]
            }
        }
    };
const
    ENGINE_SCHEMA = {
        type: 'object',
        name: 'engine',
        nameSpace: 'compositions',
        properties: {
            code: {
                type: 'string'
            },
            id: {
                type: 'integer',
                generated: true,
                format: 'id'
            },
            carId: {
                type: 'integer',
                isReadOnly: true,
                format: 'id'
            }
        },
        relations: {
            car: {
                type: 'belongsTo',
                model: 'car',
                aggregationKind: 'composite',
                invRel: 'engine',
                nameSpace: 'compositions',
                title: 'car',
                invType: 'hasOne',
                localFields: [
                    'carId'
                ],
                foreignFields: [
                    'id'
                ]
            }
        },
        meta: {
            parent: 'car',
            parentRelation: 'car'
        }
    };
const
    TREE_SCHEMA = {
        type: 'object',
        name: 'tree',
        nameSpace: 'compositions',
        properties: {
            name: {
                type: 'string'
            },
            id: {
                type: 'integer',
                generated: true,
                format: 'id'
            },
            parentId: {
                type: 'integer',
                isReadOnly: true,
                format: 'id'
            }
        },
        relations: {
            leafs: {
                type: 'hasMany',
                model: 'tree',
                aggregationKind: 'composite',
                invRel: 'parent',
                nameSpace: 'compositions',
                title: 'leafs',
                invType: 'belongsTo',
                localFields: [
                    'id'
                ],
                foreignFields: [
                    'parentId'
                ]
            },
            parent: {
                type: 'belongsTo',
                model: 'tree',
                aggregationKind: 'composite',
                invRel: 'leafs',
                nameSpace: 'compositions',
                title: 'parent',
                invType: 'hasMany',
                localFields: [
                    'parentId'
                ],
                foreignFields: [
                    'id'
                ]
            }
        },
        meta: {
            parent: 'tree',
            parentRelation: 'parent'
        }
    };
const
    CAR_REF_SCHEMA = {
        type: 'object',
        name: 'car',
        nameSpace: 'ref',
        properties: {
            name: {
                type: 'string'
            },
            id: {
                type: 'integer',
                generated: true,
                format: 'id'
            }

        },
        relations: {
            engine: {
                type: 'hasOne',
                model: 'engine',
                aggregationKind: 'composite',
                invRel: 'car',
                nameSpace: 'ref',
                title: 'engine',
                invType: 'belongsTo',
                localFields: [
                    'id'
                ],
                foreignFields: [
                    'carId'
                ]
            }
        }
    };
const
    ENGINE_REF_SCHEMA = {
        type: 'object',
        name: 'engine',
        nameSpace: 'ref',
        properties: {
            code: {
                type: 'string'
            },
            id: {
                type: 'integer',
                generated: true,
                format: 'id'
            },
            carId: {
                type: 'integer',
                isReadOnly: true,
                format: 'id'
            },
            manufacterId: {
                type: 'integer',
                isReadOnly: true,
                format: 'id'
            }
        },
        relations: {
            car: {
                type: 'belongsTo',
                model: 'car',
                aggregationKind: 'composite',
                invRel: 'engine',
                nameSpace: 'ref',
                title: 'car',
                invType: 'hasOne',
                localFields: [
                    'carId'
                ],
                foreignFields: [
                    'id'
                ]
            },
            manufacter: {
                title: 'Manufacter',
                type: 'hasOne',
                model: 'manufacter',
                localFields: [
                    'manufacterId'
                ],
                foreignFields: [
                    'id'
                ],
                nameSpace: 'ref',
                aggregationKind: 'none'
            }
        },
        meta: {
            parent: 'car',
            parentRelation: 'car'
        }
    };
const
    MANUFACTER_REF_SCHEMA = {
        type: 'object',
        name: 'manufacter',
        nameSpace: 'ref',
        properties: {
            name: {
                type: 'string'
            },
            id: {
                type: 'integer',
                generated: true,
                format: 'id'
            }
        },
        meta: {
        }
    };


describe('Schema generation', () => {
    before(() => {
        schemaManager().registerSchema(CAR_SCHEMA);
        schemaManager().registerSchema(ENGINE_SCHEMA);
        schemaManager().registerSchema(TREE_SCHEMA);
        schemaManager().registerSchema(CAR_REF_SCHEMA);
        schemaManager().registerSchema(ENGINE_REF_SCHEMA);
        schemaManager().registerSchema(MANUFACTER_REF_SCHEMA);
    });
    it('Test 1', () => {
        let pattern = {
            properties: [
                'id',
                'name',
                { 'engineId': 'engine.id' },
                { 'engineCode': 'engine.code' }
            ]
        };
        serialization.check(pattern);
        let schema = schemaManager().serialization2Schema('compositions', 'car', pattern);
        assert.deepEqual(schema, {
            type: 'object',
            properties: {
                id: {
                    type: 'integer',
                    generated: true,
                    format: 'id'
                },
                name: {
                    type: 'string'
                },
                engineId: {
                    type: 'integer',
                    generated: true,
                    format: 'id'
                },
                engineCode: {
                    type: 'string'
                }
            }
        });
    });
    it('Test 2', () => {
        let pattern = {
            properties: [
                'name',
                'engine.code'
            ]
        };
        serialization.check(pattern);
        let schema = schemaManager().serialization2Schema('compositions', 'car', pattern);
        assert.deepEqual(schema, {
            type: 'object',
            properties: {
                id: {
                    type: 'integer',
                    generated: true,
                    format: 'id'
                },
                name: {
                    type: 'string'
                },
                code: {
                    type: 'string'
                }
            }
        });
    });
    it('Test 3', () => {
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
        let schema = schemaManager().serialization2Schema('compositions', 'car', pattern);
        assert.deepEqual(schema, {
            type: 'object',
            properties: {
                id: {
                    type: 'integer',
                    generated: true,
                    format: 'id'
                },
                name: {
                    type: 'string'
                },
                engineInfo: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'integer',
                            generated: true,
                            format: 'id'
                        },
                        code: {
                            type: 'string'
                        }
                    }
                }
            }
        });
    });
    it('Test 4', () => {
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
        let schema = schemaManager().serialization2Schema('compositions', 'car', pattern);
        assert.deepEqual(schema, {
            type: 'object',
            properties: {
                id: {
                    type: 'integer',
                    generated: true,
                    format: 'id'
                },
                name: {
                    type: 'string'
                },
                engine: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'integer',
                            generated: true,
                            format: 'id'
                        },
                        code: {
                            type: 'string'
                        }
                    }
                }
            }
        });
    });

    it('Test 5', () => {
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
        let schema = schemaManager().serialization2Schema('compositions', 'tree', pattern);
        assert.deepEqual(schema, {
            type: 'object',
            properties: {
                id: {
                    type: 'integer',
                    generated: true,
                    format: 'id'
                },
                name: {
                    type: 'string'
                },
                leafs: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: {
                                type: 'integer',
                                generated: true,
                                format: 'id'
                            },
                            name: {
                                type: 'string'
                            },
                            leafs: {
                                type: 'array',
                                items: {
                                    $ref: '#/definitions/tree'
                                }
                            }
                        }
                    }
                }
            },
            definitions: {
                tree: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'integer',
                            generated: true,
                            format: 'id'
                        },
                        name: {
                            type: 'string'
                        },
                        leafs: {
                            type: 'array',
                            items: {
                                $ref: '#/definitions/tree'
                            }
                        }
                    }

                }
            }
        });
    });
    it('Test 6', () => {
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
        let schema = schemaManager().serialization2Schema('compositions', 'tree', pattern);
        assert.deepEqual(schema, {
            type: 'object',
            properties: {
                id: {
                    type: 'integer',
                    generated: true,
                    format: 'id'
                },
                name: {
                    type: 'string'
                },
                leafs: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: {
                                type: 'integer',
                                generated: true,
                                format: 'id'
                            },
                            name: {
                                type: 'string'
                            },
                            leafs: {
                                type: 'array',
                                items: {
                                    $ref: '#/definitions/tree'
                                }
                            }
                        }
                    }
                }
            },
            definitions: {
                tree: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'integer',
                            generated: true,
                            format: 'id'
                        },
                        name: {
                            type: 'string'
                        },
                        leafs: {
                            type: 'array',
                            items: {
                                $ref: '#/definitions/tree'
                            }
                        }
                    }

                }
            }
        });
    });

    it('Test 7', () => {
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
                            manufacter: 'manufacter',
                            $ref: '#/definitions/manufacter'
                        }

                    ]
                },
                manufacter: {
                    properties: [
                        'id',
                        'name'
                    ]
                }
            }
        };
        serialization.check(pattern);
        let schema = schemaManager().serialization2Schema('ref', 'car', pattern);
        assert.deepEqual(schema, {
            type: 'object',
            properties: {
                id: {
                    format: 'id',
                    generated: true,
                    type: 'integer'
                },
                engine: {
                    type: 'object',
                    properties: {
                        id: {
                            format: 'id',
                            generated: true,
                            type: 'integer'
                        },
                        manufacter: {
                            type: 'object',
                            properties: {
                                id: {
                                    format: 'id',
                                    generated: true,
                                    type: 'integer'
                                },
                                name: {
                                    type: 'string'
                                }
                            }
                        }
                    }
                }

            }
        });
    });

});

