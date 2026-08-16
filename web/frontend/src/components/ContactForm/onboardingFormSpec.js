/**
 * Onboarding Form specification (from WPForms template).
 */
const onboardingFormSpec = {
    "slug": "onboarding_form",
    "name": "Onboarding Form",
    "field_order": [
        "28",
        "48",
        "5",
        "1",
        "17",
        "16",
        "11",
        "18",
        "2",
        "15",
        "14",
        "19",
        "38",
        "20",
        "41",
        "42",
        "43",
        "44",
        "68",
        "46",
        "47",
        "21",
        "49",
        "63",
        "52",
        "208",
        "54",
        "59",
        "57",
        "58",
        "60",
        "61",
        "62",
        "64",
        "65",
        "66",
        "67",
        "69",
        "71",
        "72",
        "73",
        "74",
        "75",
        "76",
        "77",
        "78",
        "196",
        "50",
        "29",
        "30",
        "33",
        "37",
        "32",
        "31",
        "36",
        "35",
        "34",
        "39",
        "79",
        "80",
        "81",
        "82",
        "83",
        "84",
        "85",
        "86",
        "87",
        "88",
        "89",
        "90",
        "91",
        "92",
        "93",
        "94",
        "95",
        "96",
        "97",
        "98",
        "99",
        "100",
        "101",
        "114",
        "113",
        "112",
        "110",
        "109",
        "108",
        "107",
        "105",
        "104",
        "103",
        "115",
        "116",
        "117",
        "118",
        "119",
        "120",
        "121",
        "122",
        "123",
        "124",
        "125",
        "126",
        "127",
        "128",
        "129",
        "130",
        "131",
        "132",
        "133",
        "134",
        "135",
        "136",
        "137",
        "138",
        "139",
        "140",
        "141",
        "142",
        "146",
        "144",
        "147",
        "148",
        "150",
        "149",
        "152",
        "153",
        "154",
        "155",
        "156",
        "157",
        "158",
        "159",
        "160",
        "161",
        "162",
        "163",
        "210",
        "178",
        "197",
        "174",
        "175",
        "184",
        "179",
        "185",
        "186",
        "198",
        "199",
        "200",
        "201",
        "202",
        "203",
        "180",
        "181",
        "182",
        "176",
        "183",
        "187",
        "188",
        "189",
        "190",
        "191",
        "192",
        "193",
        "194",
        "204",
        "205",
        "206",
        "207",
        "214",
        "215",
        "211",
        "212",
        "213"
    ],
    "fields": {
        "28": {
            "id": "28",
            "type": "select",
            "label": "Select account type:",
            "required": true,
            "placeholder": "- Select Account Type -",
            "choices": [
                {
                    "value": "1",
                    "label": "Individual Account"
                },
                {
                    "value": "2",
                    "label": "Joint Account"
                },
                {
                    "value": "3",
                    "label": "Group/Company Account"
                }
            ],
            "css": "wpforms-one-third wpforms-first",
            "conditional_logic": false,
            "size": "large"
        },
        "48": {
            "id": "48",
            "type": "divider",
            "label": "Personal Details:",
            "required": false,
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "1"
                    }
                ]
            ],
            "label_disable": true
        },
        "5": {
            "id": "5",
            "type": "radio",
            "label": "Have you been a member before?",
            "required": true,
            "choices": [
                {
                    "value": "1",
                    "label": "Yes"
                },
                {
                    "value": "2",
                    "label": "No"
                }
            ],
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "1"
                    }
                ]
            ],
            "input_columns": "inline"
        },
        "1": {
            "id": "1",
            "type": "name",
            "label": "Your Name:",
            "required": true,
            "format": "first-last",
            "css": "wpforms-two-thirds wpforms-firstwpforms-two-thirds wpforms-first",
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "1"
                    }
                ]
            ],
            "size": "large"
        },
        "17": {
            "id": "17",
            "type": "date-time",
            "label": "Date of Birth:",
            "required": true,
            "format": "date",
            "date_format": "d/m/Y",
            "css": "wpforms-one-third",
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "1"
                    }
                ]
            ],
            "size": "large"
        },
        "16": {
            "id": "16",
            "type": "phone",
            "label": "Mobile Number:",
            "required": true,
            "format": "smart",
            "css": "wpforms-one-third wpforms-first",
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "1"
                    }
                ]
            ],
            "size": "large"
        },
        "11": {
            "id": "11",
            "type": "number",
            "label": "Valid ID/Passport Number",
            "required": true,
            "placeholder": "Enter your ID/Passport No.",
            "css": "wpforms-one-third",
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "1"
                    }
                ]
            ],
            "size": "large"
        },
        "18": {
            "id": "18",
            "type": "file-upload",
            "label": "Attach ID/Passport (Front & Back):",
            "required": false,
            "max_file_number": 2,
            "css": "wpforms-one-third",
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "1"
                    }
                ]
            ]
        },
        "2": {
            "id": "2",
            "type": "email",
            "label": "Your Email Address:",
            "required": true,
            "css": "wpforms-one-third wpforms-first",
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "1"
                    }
                ]
            ],
            "size": "large"
        },
        "15": {
            "id": "15",
            "type": "radio",
            "label": "Marital status:",
            "required": true,
            "choices": [
                {
                    "value": "1",
                    "label": "Single"
                },
                {
                    "value": "2",
                    "label": "Married"
                }
            ],
            "css": "wpforms-one-third",
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "1"
                    }
                ]
            ],
            "input_columns": "inline"
        },
        "14": {
            "id": "14",
            "type": "select",
            "label": "Sex:",
            "required": true,
            "placeholder": "- Sex -",
            "choices": [
                {
                    "value": "1",
                    "label": "Male"
                },
                {
                    "value": "2",
                    "label": "Female"
                },
                {
                    "value": "3",
                    "label": "Other"
                }
            ],
            "css": "wpforms-one-third wpforms-last",
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "1"
                    }
                ]
            ],
            "size": "large"
        },
        "19": {
            "id": "19",
            "type": "text",
            "label": "Your KRA PIN number:",
            "required": true,
            "limit_count": 1,
            "limit_mode": "characters",
            "css": "wpforms-one-third wpforms-first",
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "1"
                    }
                ]
            ],
            "size": "large"
        },
        "38": {
            "id": "38",
            "type": "file-upload",
            "label": "Attach your KRA PIN Certificate:",
            "required": true,
            "max_file_number": 1,
            "css": "wpforms-one-third",
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "1"
                    }
                ]
            ]
        },
        "20": {
            "id": "20",
            "type": "file-upload",
            "label": "Attach Your Passport Photo:",
            "required": true,
            "max_file_number": 1,
            "css": "wpforms-one-third",
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "1"
                    }
                ]
            ]
        },
        "41": {
            "id": "41",
            "type": "number",
            "label": "Postal Address:",
            "required": true,
            "css": "wpforms-one-third wpforms-first",
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "1"
                    }
                ]
            ],
            "size": "large"
        },
        "42": {
            "id": "42",
            "type": "number",
            "label": "Postal Code:",
            "required": true,
            "css": "wpforms-one-third",
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "1"
                    }
                ]
            ],
            "size": "large"
        },
        "43": {
            "id": "43",
            "type": "text",
            "label": "Town:",
            "required": true,
            "limit_count": 1,
            "limit_mode": "characters",
            "css": "wpforms-one-third",
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "1"
                    }
                ]
            ],
            "size": "large"
        },
        "44": {
            "id": "44",
            "type": "text",
            "label": "Residence:",
            "required": true,
            "limit_count": 1,
            "limit_mode": "characters",
            "css": "wpforms-one-fourth wpforms-first",
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "1"
                    }
                ]
            ],
            "size": "large"
        },
        "68": {
            "id": "68",
            "type": "select",
            "label": "County",
            "required": true,
            "placeholder": "- Select County -",
            "choices": [
                {
                    "value": "4",
                    "label": "Baringo"
                },
                {
                    "value": "5",
                    "label": "Bomet"
                },
                {
                    "value": "6",
                    "label": "Bungoma"
                },
                {
                    "value": "7",
                    "label": "Busia"
                },
                {
                    "value": "8",
                    "label": "Elgeyo-Marakwet"
                },
                {
                    "value": "9",
                    "label": "Embu"
                },
                {
                    "value": "10",
                    "label": "Garissa"
                },
                {
                    "value": "11",
                    "label": "Homa Bay"
                },
                {
                    "value": "12",
                    "label": "Isiolo"
                },
                {
                    "value": "13",
                    "label": "Kajiado"
                },
                {
                    "value": "14",
                    "label": "Kakamega"
                },
                {
                    "value": "15",
                    "label": "Kericho"
                },
                {
                    "value": "16",
                    "label": "Kiambu"
                },
                {
                    "value": "17",
                    "label": "Kilifi"
                },
                {
                    "value": "18",
                    "label": "Kirinyaga"
                },
                {
                    "value": "19",
                    "label": "Kisii"
                },
                {
                    "value": "20",
                    "label": "Kisumu"
                },
                {
                    "value": "21",
                    "label": "Kitui"
                },
                {
                    "value": "22",
                    "label": "Kwale"
                },
                {
                    "value": "23",
                    "label": "Laikipia"
                },
                {
                    "value": "24",
                    "label": "Lamu"
                },
                {
                    "value": "25",
                    "label": "Machakos"
                },
                {
                    "value": "26",
                    "label": "Makueni"
                },
                {
                    "value": "27",
                    "label": "Mandera"
                },
                {
                    "value": "28",
                    "label": "Marsabit"
                },
                {
                    "value": "29",
                    "label": "Meru"
                },
                {
                    "value": "30",
                    "label": "Migori"
                },
                {
                    "value": "31",
                    "label": "Mombasa"
                },
                {
                    "value": "32",
                    "label": "Murang’a"
                },
                {
                    "value": "33",
                    "label": "Nairobi"
                },
                {
                    "value": "34",
                    "label": "Nakuru"
                },
                {
                    "value": "35",
                    "label": "Nandi"
                },
                {
                    "value": "36",
                    "label": "Narok"
                },
                {
                    "value": "37",
                    "label": "Nyamira"
                },
                {
                    "value": "38",
                    "label": "Nyandarua"
                },
                {
                    "value": "39",
                    "label": "Nyeri"
                },
                {
                    "value": "40",
                    "label": "Samburu"
                },
                {
                    "value": "41",
                    "label": "Siaya"
                },
                {
                    "value": "42",
                    "label": "Taita Taveta"
                },
                {
                    "value": "43",
                    "label": "Tana River"
                },
                {
                    "value": "44",
                    "label": "Tharaka-Nithi"
                },
                {
                    "value": "45",
                    "label": "Trans-Nzoia"
                },
                {
                    "value": "46",
                    "label": "Turkana"
                },
                {
                    "value": "47",
                    "label": "Uasin Gishu"
                },
                {
                    "value": "48",
                    "label": "Vihiga"
                },
                {
                    "value": "49",
                    "label": "Wajir"
                },
                {
                    "value": "50",
                    "label": "West Pokot"
                }
            ],
            "css": "wpforms-one-fourth",
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "1"
                    }
                ]
            ],
            "size": "large"
        },
        "46": {
            "id": "46",
            "type": "text",
            "label": "Sub-county:",
            "required": false,
            "limit_count": 1,
            "limit_mode": "characters",
            "css": "wpforms-one-fourth",
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "1"
                    }
                ]
            ],
            "size": "large"
        },
        "47": {
            "id": "47",
            "type": "text",
            "label": "Ward:",
            "required": false,
            "limit_count": 1,
            "limit_mode": "characters",
            "css": "wpforms-one-fourth",
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "1"
                    }
                ]
            ],
            "size": "large"
        },
        "21": {
            "id": "21",
            "type": "file-upload",
            "label": "Attach Your Signature:",
            "required": true,
            "max_file_number": 1,
            "css": "wpforms-one-third wpforms-first",
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "1"
                    }
                ]
            ]
        },
        "49": {
            "id": "49",
            "type": "divider",
            "label": "Employment Details:",
            "required": false,
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "1"
                    }
                ]
            ],
            "label_disable": true
        },
        "63": {
            "id": "63",
            "type": "radio",
            "label": "Employment type:",
            "required": true,
            "choices": [
                {
                    "value": "1",
                    "label": "Employed"
                },
                {
                    "value": "2",
                    "label": "Business"
                }
            ],
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "1"
                    }
                ]
            ],
            "input_columns": "inline"
        },
        "52": {
            "id": "52",
            "type": "text",
            "label": "Employer:",
            "required": true,
            "limit_count": 1,
            "limit_mode": "characters",
            "css": "wpforms-one-third wpforms-first",
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "1"
                    },
                    {
                        "field": "63",
                        "operator": "==",
                        "value": "1"
                    }
                ]
            ],
            "size": "large"
        },
        "208": {
            "id": "208",
            "type": "text",
            "label": "Employer Address:",
            "required": true,
            "limit_count": 1,
            "limit_mode": "characters",
            "css": "wpforms-two-thirds",
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "1"
                    },
                    {
                        "field": "63",
                        "operator": "==",
                        "value": "1"
                    }
                ]
            ],
            "size": "large"
        },
        "54": {
            "id": "54",
            "type": "text",
            "label": "Designation:",
            "required": true,
            "limit_count": 1,
            "limit_mode": "characters",
            "css": "wpforms-one-half wpforms-first",
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "1"
                    },
                    {
                        "field": "63",
                        "operator": "==",
                        "value": "1"
                    }
                ]
            ],
            "size": "large"
        },
        "59": {
            "id": "59",
            "type": "radio",
            "label": "Employment terms:",
            "required": true,
            "choices": [
                {
                    "value": "1",
                    "label": "Permanent"
                },
                {
                    "value": "2",
                    "label": "Contract"
                },
                {
                    "value": "3",
                    "label": "Casual"
                }
            ],
            "css": "wpforms-one-half",
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "1"
                    },
                    {
                        "field": "63",
                        "operator": "==",
                        "value": "1"
                    }
                ]
            ],
            "input_columns": "inline"
        },
        "57": {
            "id": "57",
            "type": "text",
            "label": "Staff/check number:",
            "required": false,
            "limit_count": 1,
            "limit_mode": "characters",
            "css": "wpforms-one-third wpforms-first",
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "1"
                    },
                    {
                        "field": "63",
                        "operator": "==",
                        "value": "1"
                    }
                ]
            ],
            "size": "large"
        },
        "58": {
            "id": "58",
            "type": "text",
            "label": "Workstation:",
            "required": false,
            "limit_count": 1,
            "limit_mode": "characters",
            "css": "wpforms-one-third",
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "1"
                    },
                    {
                        "field": "63",
                        "operator": "==",
                        "value": "1"
                    }
                ]
            ],
            "size": "large"
        },
        "60": {
            "id": "60",
            "type": "date-time",
            "label": "Specify contract end date:",
            "required": true,
            "format": "date",
            "date_format": "d/m/Y",
            "css": "wpforms-one-third",
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "1"
                    },
                    {
                        "field": "59",
                        "operator": "==",
                        "value": "2"
                    },
                    {
                        "field": "63",
                        "operator": "==",
                        "value": "1"
                    }
                ]
            ],
            "size": "large"
        },
        "61": {
            "id": "61",
            "type": "text",
            "label": "Pensioner (name of former employer):",
            "required": true,
            "limit_count": 1,
            "limit_mode": "characters",
            "css": "wpforms-one-third",
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "1"
                    },
                    {
                        "field": "59",
                        "operator": "==",
                        "value": "1"
                    },
                    {
                        "field": "63",
                        "operator": "==",
                        "value": "1"
                    }
                ]
            ],
            "size": "large"
        },
        "62": {
            "id": "62",
            "type": "text",
            "label": "Staff pension number:",
            "required": true,
            "limit_count": 1,
            "limit_mode": "characters",
            "css": "wpforms-one-third wpforms-first",
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "1"
                    },
                    {
                        "field": "59",
                        "operator": "==",
                        "value": "1"
                    },
                    {
                        "field": "63",
                        "operator": "==",
                        "value": "1"
                    }
                ]
            ],
            "size": "large"
        },
        "64": {
            "id": "64",
            "type": "text",
            "label": "Business name:",
            "required": true,
            "limit_count": 1,
            "limit_mode": "characters",
            "css": "wpforms-one-half wpforms-first",
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "1"
                    },
                    {
                        "field": "63",
                        "operator": "==",
                        "value": "2"
                    }
                ]
            ],
            "size": "large"
        },
        "65": {
            "id": "65",
            "type": "text",
            "label": "Nature of business:",
            "required": true,
            "limit_count": 1,
            "limit_mode": "characters",
            "css": "wpforms-one-half",
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "1"
                    },
                    {
                        "field": "63",
                        "operator": "==",
                        "value": "2"
                    }
                ]
            ],
            "size": "large"
        },
        "66": {
            "id": "66",
            "type": "text",
            "label": "Business address:",
            "required": true,
            "limit_count": 1,
            "limit_mode": "characters",
            "css": "wpforms-one-half wpforms-first",
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "1"
                    },
                    {
                        "field": "63",
                        "operator": "==",
                        "value": "2"
                    }
                ]
            ],
            "size": "large"
        },
        "67": {
            "id": "67",
            "type": "text",
            "label": "Business location:",
            "required": true,
            "limit_count": 1,
            "limit_mode": "characters",
            "css": "wpforms-one-half",
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "1"
                    },
                    {
                        "field": "63",
                        "operator": "==",
                        "value": "2"
                    }
                ]
            ],
            "size": "large"
        },
        "69": {
            "id": "69",
            "type": "divider",
            "label": "Monthly Contributions:",
            "required": false,
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "1"
                    }
                ]
            ],
            "label_disable": true
        },
        "71": {
            "id": "71",
            "type": "number",
            "label": "Propose monthly contributions (KSH):",
            "required": true,
            "css": "wpforms-one-half wpforms-first",
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "1"
                    }
                ]
            ],
            "size": "large"
        },
        "72": {
            "id": "72",
            "type": "text",
            "label": "Amount in words:",
            "required": true,
            "limit_count": 1,
            "limit_mode": "characters",
            "css": "wpforms-one-half",
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "1"
                    }
                ]
            ],
            "size": "large"
        },
        "73": {
            "id": "73",
            "type": "checkbox",
            "label": "Proposed mode of remittance:",
            "required": true,
            "choices": [
                {
                    "value": "1",
                    "label": "Check Off"
                },
                {
                    "value": "2",
                    "label": "Standing Order"
                },
                {
                    "value": "3",
                    "label": "Direct Debit"
                },
                {
                    "value": "4",
                    "label": "Other"
                }
            ],
            "css": "wpforms-one-third wpforms-first",
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "1"
                    }
                ]
            ],
            "input_columns": "inline"
        },
        "74": {
            "id": "74",
            "type": "text",
            "label": "If other, specify:",
            "required": true,
            "limit_count": 1,
            "limit_mode": "characters",
            "css": "wpforms-one-third",
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "1"
                    },
                    {
                        "field": "73",
                        "operator": "==",
                        "value": "4"
                    }
                ]
            ],
            "size": "large"
        },
        "75": {
            "id": "75",
            "type": "date-time",
            "label": "Effective date:",
            "required": true,
            "format": "date",
            "date_format": "d/m/Y",
            "css": "wpforms-one-third",
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "1"
                    }
                ]
            ],
            "size": "large"
        },
        "76": {
            "id": "76",
            "type": "name",
            "label": "Next of kin name",
            "required": true,
            "format": "first-last",
            "css": "wpforms-one-third wpforms-first",
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "1"
                    }
                ]
            ],
            "size": "large"
        },
        "77": {
            "id": "77",
            "type": "text",
            "label": "Relationship:",
            "required": true,
            "limit_count": 1,
            "limit_mode": "characters",
            "css": "wpforms-one-third",
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "1"
                    }
                ]
            ],
            "size": "large"
        },
        "78": {
            "id": "78",
            "type": "phone",
            "label": "Mobile Number:",
            "required": true,
            "format": "smart",
            "css": "wpforms-one-third",
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "1"
                    }
                ]
            ],
            "size": "large"
        },
        "196": {
            "id": "196",
            "type": "select",
            "label": "How many partners are you?",
            "required": true,
            "placeholder": "- Select No -",
            "choices": [
                {
                    "value": "1",
                    "label": "2"
                },
                {
                    "value": "2",
                    "label": "3"
                },
                {
                    "value": "3",
                    "label": "4"
                }
            ],
            "css": "wpforms-one-third wpforms-first",
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "2"
                    }
                ]
            ],
            "size": "large"
        },
        "50": {
            "id": "50",
            "type": "divider",
            "label": "Partner 1 Personal Details:",
            "required": false,
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "2"
                    }
                ]
            ],
            "label_disable": true
        },
        "29": {
            "id": "29",
            "type": "name",
            "label": "Your name:",
            "required": true,
            "format": "first-last",
            "css": "w wpforms-two-thirds wpforms-first",
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "2"
                    }
                ]
            ],
            "size": "large"
        },
        "30": {
            "id": "30",
            "type": "date-time",
            "label": "Date of birth:",
            "required": true,
            "format": "date",
            "date_format": "d/m/Y",
            "css": "wpforms-one-third",
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "2"
                    }
                ]
            ],
            "size": "large"
        },
        "33": {
            "id": "33",
            "type": "select",
            "label": "Sex:",
            "required": true,
            "placeholder": "- Sex -",
            "choices": [
                {
                    "value": "1",
                    "label": "Male"
                },
                {
                    "value": "2",
                    "label": "Female"
                },
                {
                    "value": "3",
                    "label": "Other"
                }
            ],
            "css": "wpforms-one-fourth wpforms-first",
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "2"
                    }
                ]
            ],
            "size": "large"
        },
        "37": {
            "id": "37",
            "type": "phone",
            "label": "Mobile Number:",
            "required": true,
            "format": "smart",
            "css": "wpforms-one-fourth",
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "2"
                    }
                ]
            ],
            "size": "large"
        },
        "32": {
            "id": "32",
            "type": "email",
            "label": "Email address:",
            "required": true,
            "css": "wpforms-one-fourth",
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "2"
                    }
                ]
            ],
            "size": "large"
        },
        "31": {
            "id": "31",
            "type": "radio",
            "label": "Your marital status:",
            "required": true,
            "choices": [
                {
                    "value": "1",
                    "label": "Single"
                },
                {
                    "value": "2",
                    "label": "Married"
                }
            ],
            "css": "wpforms-one-fourth",
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "2"
                    }
                ]
            ],
            "input_columns": "inline"
        },
        "36": {
            "id": "36",
            "type": "number",
            "label": "Valid ID/Passport Number:",
            "required": true,
            "placeholder": "Enter your national ID No.",
            "css": "wpforms-one-fourth wpforms-first",
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "2"
                    }
                ]
            ],
            "size": "large"
        },
        "35": {
            "id": "35",
            "type": "file-upload",
            "label": "Attach ID/Passport (Front & Back):",
            "required": true,
            "max_file_number": 2,
            "css": "wpforms-one-fourth",
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "2"
                    }
                ]
            ]
        },
        "34": {
            "id": "34",
            "type": "text",
            "label": "KRA PIN Number:",
            "required": true,
            "limit_count": 1,
            "limit_mode": "characters",
            "css": "wpforms-one-fourth",
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "2"
                    }
                ]
            ],
            "size": "large"
        },
        "39": {
            "id": "39",
            "type": "file-upload",
            "label": "Attach Your KRA PIN:",
            "required": true,
            "max_file_number": 1,
            "css": "wpforms-one-fourth",
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "2"
                    }
                ]
            ]
        },
        "79": {
            "id": "79",
            "type": "divider",
            "label": "Partner 2 Personal Details:",
            "required": false,
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "2"
                    },
                    {
                        "field": "196",
                        "operator": "==",
                        "value": "1"
                    }
                ],
                [
                    {
                        "field": "196",
                        "operator": "==",
                        "value": "2"
                    }
                ],
                [
                    {
                        "field": "196",
                        "operator": "==",
                        "value": "3"
                    }
                ]
            ],
            "label_disable": true
        },
        "80": {
            "id": "80",
            "type": "name",
            "label": "Your name:",
            "required": true,
            "format": "first-last",
            "css": "w wpforms-two-thirds wpforms-first",
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "2"
                    },
                    {
                        "field": "196",
                        "operator": "==",
                        "value": "1"
                    }
                ],
                [
                    {
                        "field": "196",
                        "operator": "==",
                        "value": "2"
                    }
                ],
                [
                    {
                        "field": "196",
                        "operator": "==",
                        "value": "3"
                    }
                ]
            ],
            "size": "large"
        },
        "81": {
            "id": "81",
            "type": "date-time",
            "label": "Date of birth:",
            "required": true,
            "format": "date",
            "date_format": "d/m/Y",
            "css": "wpforms-one-third",
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "2"
                    },
                    {
                        "field": "196",
                        "operator": "==",
                        "value": "1"
                    }
                ],
                [
                    {
                        "field": "196",
                        "operator": "==",
                        "value": "2"
                    }
                ],
                [
                    {
                        "field": "196",
                        "operator": "==",
                        "value": "3"
                    }
                ]
            ],
            "size": "large"
        },
        "82": {
            "id": "82",
            "type": "select",
            "label": "Sex:",
            "required": true,
            "placeholder": "- Sex -",
            "choices": [
                {
                    "value": "1",
                    "label": "Male"
                },
                {
                    "value": "2",
                    "label": "Female"
                },
                {
                    "value": "3",
                    "label": "Other"
                }
            ],
            "css": "wpforms-one-fourth wpforms-first",
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "2"
                    },
                    {
                        "field": "196",
                        "operator": "==",
                        "value": "1"
                    }
                ],
                [
                    {
                        "field": "196",
                        "operator": "==",
                        "value": "2"
                    }
                ],
                [
                    {
                        "field": "196",
                        "operator": "==",
                        "value": "3"
                    }
                ]
            ],
            "size": "large"
        },
        "83": {
            "id": "83",
            "type": "phone",
            "label": "Mobile Number:",
            "required": true,
            "format": "smart",
            "css": "wpforms-one-fourth",
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "2"
                    },
                    {
                        "field": "196",
                        "operator": "==",
                        "value": "1"
                    }
                ],
                [
                    {
                        "field": "196",
                        "operator": "==",
                        "value": "2"
                    }
                ],
                [
                    {
                        "field": "196",
                        "operator": "==",
                        "value": "3"
                    }
                ]
            ],
            "size": "large"
        },
        "84": {
            "id": "84",
            "type": "email",
            "label": "Email address:",
            "required": true,
            "css": "wpforms-one-fourth",
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "2"
                    },
                    {
                        "field": "196",
                        "operator": "==",
                        "value": "1"
                    }
                ],
                [
                    {
                        "field": "196",
                        "operator": "==",
                        "value": "2"
                    }
                ],
                [
                    {
                        "field": "196",
                        "operator": "==",
                        "value": "3"
                    }
                ]
            ],
            "size": "large"
        },
        "85": {
            "id": "85",
            "type": "radio",
            "label": "Your marital status:",
            "required": true,
            "choices": [
                {
                    "value": "1",
                    "label": "Single"
                },
                {
                    "value": "2",
                    "label": "Married"
                }
            ],
            "css": "wpforms-one-fourth",
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "2"
                    },
                    {
                        "field": "196",
                        "operator": "==",
                        "value": "1"
                    }
                ],
                [
                    {
                        "field": "196",
                        "operator": "==",
                        "value": "2"
                    }
                ],
                [
                    {
                        "field": "196",
                        "operator": "==",
                        "value": "3"
                    }
                ]
            ],
            "input_columns": "inline"
        },
        "86": {
            "id": "86",
            "type": "number",
            "label": "Valid ID/Passport Number:",
            "required": true,
            "placeholder": "Enter your national ID No.",
            "css": "wpforms-one-fourth wpforms-first",
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "2"
                    },
                    {
                        "field": "196",
                        "operator": "==",
                        "value": "1"
                    }
                ],
                [
                    {
                        "field": "196",
                        "operator": "==",
                        "value": "2"
                    }
                ],
                [
                    {
                        "field": "196",
                        "operator": "==",
                        "value": "3"
                    }
                ]
            ],
            "size": "large"
        },
        "87": {
            "id": "87",
            "type": "file-upload",
            "label": "Attach ID/Passport (Front & Back):",
            "required": true,
            "max_file_number": 2,
            "css": "wpforms-one-fourth",
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "2"
                    },
                    {
                        "field": "196",
                        "operator": "==",
                        "value": "1"
                    }
                ],
                [
                    {
                        "field": "196",
                        "operator": "==",
                        "value": "2"
                    }
                ],
                [
                    {
                        "field": "196",
                        "operator": "==",
                        "value": "3"
                    }
                ]
            ]
        },
        "88": {
            "id": "88",
            "type": "text",
            "label": "KRA PIN Number:",
            "required": true,
            "limit_count": 1,
            "limit_mode": "characters",
            "css": "wpforms-one-fourth",
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "2"
                    },
                    {
                        "field": "196",
                        "operator": "==",
                        "value": "1"
                    }
                ],
                [
                    {
                        "field": "196",
                        "operator": "==",
                        "value": "2"
                    }
                ],
                [
                    {
                        "field": "196",
                        "operator": "==",
                        "value": "3"
                    }
                ]
            ],
            "size": "large"
        },
        "89": {
            "id": "89",
            "type": "file-upload",
            "label": "Attach Your KRA PIN:",
            "required": true,
            "max_file_number": 1,
            "css": "wpforms-one-fourth",
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "2"
                    },
                    {
                        "field": "196",
                        "operator": "==",
                        "value": "1"
                    }
                ],
                [
                    {
                        "field": "196",
                        "operator": "==",
                        "value": "2"
                    }
                ],
                [
                    {
                        "field": "196",
                        "operator": "==",
                        "value": "3"
                    }
                ]
            ]
        },
        "90": {
            "id": "90",
            "type": "divider",
            "label": "Partner 3 Personal Details:",
            "required": false,
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "2"
                    },
                    {
                        "field": "196",
                        "operator": "==",
                        "value": "2"
                    }
                ],
                [
                    {
                        "field": "196",
                        "operator": "==",
                        "value": "3"
                    }
                ]
            ],
            "label_disable": true
        },
        "91": {
            "id": "91",
            "type": "name",
            "label": "Your name:",
            "required": true,
            "format": "first-last",
            "css": "w wpforms-two-thirds wpforms-first",
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "2"
                    },
                    {
                        "field": "196",
                        "operator": "==",
                        "value": "2"
                    }
                ],
                [
                    {
                        "field": "196",
                        "operator": "==",
                        "value": "3"
                    }
                ]
            ],
            "size": "large"
        },
        "92": {
            "id": "92",
            "type": "date-time",
            "label": "Date of birth:",
            "required": true,
            "format": "date",
            "date_format": "d/m/Y",
            "css": "wpforms-one-third",
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "2"
                    },
                    {
                        "field": "196",
                        "operator": "==",
                        "value": "2"
                    }
                ],
                [
                    {
                        "field": "196",
                        "operator": "==",
                        "value": "3"
                    }
                ]
            ],
            "size": "large"
        },
        "93": {
            "id": "93",
            "type": "select",
            "label": "Sex:",
            "required": true,
            "placeholder": "- Sex -",
            "choices": [
                {
                    "value": "1",
                    "label": "Male"
                },
                {
                    "value": "2",
                    "label": "Female"
                },
                {
                    "value": "3",
                    "label": "Other"
                }
            ],
            "css": "wpforms-one-fourth wpforms-first",
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "2"
                    },
                    {
                        "field": "196",
                        "operator": "==",
                        "value": "2"
                    }
                ],
                [
                    {
                        "field": "196",
                        "operator": "==",
                        "value": "3"
                    }
                ]
            ],
            "size": "large"
        },
        "94": {
            "id": "94",
            "type": "phone",
            "label": "Mobile Number:",
            "required": true,
            "format": "smart",
            "css": "wpforms-one-fourth",
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "2"
                    },
                    {
                        "field": "196",
                        "operator": "==",
                        "value": "2"
                    }
                ],
                [
                    {
                        "field": "196",
                        "operator": "==",
                        "value": "3"
                    }
                ]
            ],
            "size": "large"
        },
        "95": {
            "id": "95",
            "type": "email",
            "label": "Email address:",
            "required": true,
            "css": "wpforms-one-fourth",
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "2"
                    },
                    {
                        "field": "196",
                        "operator": "==",
                        "value": "2"
                    }
                ],
                [
                    {
                        "field": "196",
                        "operator": "==",
                        "value": "3"
                    }
                ]
            ],
            "size": "large"
        },
        "96": {
            "id": "96",
            "type": "radio",
            "label": "Your marital status:",
            "required": true,
            "choices": [
                {
                    "value": "1",
                    "label": "Single"
                },
                {
                    "value": "2",
                    "label": "Married"
                }
            ],
            "css": "wpforms-one-fourth",
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "2"
                    },
                    {
                        "field": "196",
                        "operator": "==",
                        "value": "2"
                    }
                ],
                [
                    {
                        "field": "196",
                        "operator": "==",
                        "value": "3"
                    }
                ]
            ],
            "input_columns": "inline"
        },
        "97": {
            "id": "97",
            "type": "number",
            "label": "Valid ID/Passport Number:",
            "required": true,
            "placeholder": "Enter your national ID No.",
            "css": "wpforms-one-fourth wpforms-first",
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "2"
                    },
                    {
                        "field": "196",
                        "operator": "==",
                        "value": "2"
                    }
                ],
                [
                    {
                        "field": "196",
                        "operator": "==",
                        "value": "3"
                    }
                ]
            ],
            "size": "large"
        },
        "98": {
            "id": "98",
            "type": "file-upload",
            "label": "Attach ID/Passport (Front & Back):",
            "required": true,
            "max_file_number": 2,
            "css": "wpforms-one-fourth",
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "2"
                    },
                    {
                        "field": "196",
                        "operator": "==",
                        "value": "2"
                    }
                ],
                [
                    {
                        "field": "196",
                        "operator": "==",
                        "value": "3"
                    }
                ]
            ]
        },
        "99": {
            "id": "99",
            "type": "text",
            "label": "KRA PIN Number:",
            "required": true,
            "limit_count": 1,
            "limit_mode": "characters",
            "css": "wpforms-one-fourth",
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "2"
                    },
                    {
                        "field": "196",
                        "operator": "==",
                        "value": "2"
                    }
                ],
                [
                    {
                        "field": "196",
                        "operator": "==",
                        "value": "3"
                    }
                ]
            ],
            "size": "large"
        },
        "100": {
            "id": "100",
            "type": "file-upload",
            "label": "Attach Your KRA PIN:",
            "required": true,
            "max_file_number": 1,
            "css": "wpforms-one-fourth",
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "2"
                    },
                    {
                        "field": "196",
                        "operator": "==",
                        "value": "2"
                    }
                ],
                [
                    {
                        "field": "196",
                        "operator": "==",
                        "value": "3"
                    }
                ]
            ]
        },
        "101": {
            "id": "101",
            "type": "divider",
            "label": "Partner 4 Personal Details:",
            "required": false,
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "2"
                    },
                    {
                        "field": "196",
                        "operator": "==",
                        "value": "3"
                    }
                ]
            ],
            "label_disable": true
        },
        "114": {
            "id": "114",
            "type": "name",
            "label": "Your name:",
            "required": true,
            "format": "first-last",
            "css": "w wpforms-two-thirds wpforms-first",
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "2"
                    },
                    {
                        "field": "196",
                        "operator": "==",
                        "value": "3"
                    }
                ]
            ],
            "size": "large"
        },
        "113": {
            "id": "113",
            "type": "date-time",
            "label": "Date of birth:",
            "required": true,
            "format": "date",
            "date_format": "d/m/Y",
            "css": "wpforms-one-third",
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "2"
                    },
                    {
                        "field": "196",
                        "operator": "==",
                        "value": "3"
                    }
                ]
            ],
            "size": "large"
        },
        "112": {
            "id": "112",
            "type": "select",
            "label": "Sex:",
            "required": true,
            "placeholder": "- Sex -",
            "choices": [
                {
                    "value": "1",
                    "label": "Male"
                },
                {
                    "value": "2",
                    "label": "Female"
                },
                {
                    "value": "3",
                    "label": "Other"
                }
            ],
            "css": "wpforms-one-fourth wpforms-first",
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "2"
                    },
                    {
                        "field": "196",
                        "operator": "==",
                        "value": "3"
                    }
                ]
            ],
            "size": "large"
        },
        "110": {
            "id": "110",
            "type": "phone",
            "label": "Mobile Number:",
            "required": true,
            "format": "smart",
            "css": "wpforms-one-fourth",
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "2"
                    },
                    {
                        "field": "196",
                        "operator": "==",
                        "value": "3"
                    }
                ]
            ],
            "size": "large"
        },
        "109": {
            "id": "109",
            "type": "email",
            "label": "Email address:",
            "required": true,
            "css": "wpforms-one-fourth",
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "2"
                    },
                    {
                        "field": "196",
                        "operator": "==",
                        "value": "3"
                    }
                ]
            ],
            "size": "large"
        },
        "108": {
            "id": "108",
            "type": "radio",
            "label": "Your marital status:",
            "required": true,
            "choices": [
                {
                    "value": "1",
                    "label": "Single"
                },
                {
                    "value": "2",
                    "label": "Married"
                }
            ],
            "css": "wpforms-one-fourth",
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "2"
                    },
                    {
                        "field": "196",
                        "operator": "==",
                        "value": "3"
                    }
                ]
            ],
            "input_columns": "inline"
        },
        "107": {
            "id": "107",
            "type": "number",
            "label": "Valid ID/Passport Number:",
            "required": true,
            "placeholder": "Enter your national ID No.",
            "css": "wpforms-one-fourth wpforms-first",
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "2"
                    },
                    {
                        "field": "196",
                        "operator": "==",
                        "value": "3"
                    }
                ]
            ],
            "size": "large"
        },
        "105": {
            "id": "105",
            "type": "file-upload",
            "label": "Attach ID/Passport (Front & Back):",
            "required": true,
            "max_file_number": 2,
            "css": "wpforms-one-fourth",
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "2"
                    },
                    {
                        "field": "196",
                        "operator": "==",
                        "value": "3"
                    }
                ]
            ]
        },
        "104": {
            "id": "104",
            "type": "text",
            "label": "KRA PIN Number:",
            "required": true,
            "limit_count": 1,
            "limit_mode": "characters",
            "css": "wpforms-one-fourth",
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "2"
                    },
                    {
                        "field": "196",
                        "operator": "==",
                        "value": "3"
                    }
                ]
            ],
            "size": "large"
        },
        "103": {
            "id": "103",
            "type": "file-upload",
            "label": "Attach Your KRA PIN:",
            "required": true,
            "max_file_number": 1,
            "css": "wpforms-one-fourth",
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "2"
                    },
                    {
                        "field": "196",
                        "operator": "==",
                        "value": "3"
                    }
                ]
            ]
        },
        "115": {
            "id": "115",
            "type": "divider",
            "label": "Monthly Contributions:",
            "required": false,
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "2"
                    }
                ]
            ],
            "label_disable": true
        },
        "116": {
            "id": "116",
            "type": "number",
            "label": "Propose monthly contributions (KSH):",
            "required": true,
            "css": "wpforms-one-third wpforms-first",
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "2"
                    }
                ]
            ],
            "size": "large"
        },
        "117": {
            "id": "117",
            "type": "text",
            "label": "Amount in words:",
            "required": true,
            "limit_count": 1,
            "limit_mode": "characters",
            "css": "wpforms-two-thirds",
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "2"
                    }
                ]
            ],
            "size": "large"
        },
        "118": {
            "id": "118",
            "type": "checkbox",
            "label": "Proposed mode of remittance:",
            "required": true,
            "choices": [
                {
                    "value": "1",
                    "label": "Check Off"
                },
                {
                    "value": "2",
                    "label": "Standing Order"
                },
                {
                    "value": "3",
                    "label": "Direct Debit"
                },
                {
                    "value": "4",
                    "label": "Other"
                }
            ],
            "css": "wpforms-one-third wpforms-first",
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "2"
                    }
                ]
            ],
            "input_columns": "inline"
        },
        "119": {
            "id": "119",
            "type": "text",
            "label": "If other, specify:",
            "required": true,
            "limit_count": 1,
            "limit_mode": "characters",
            "css": "wpforms-one-third",
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "2"
                    },
                    {
                        "field": "118",
                        "operator": "==",
                        "value": "4"
                    }
                ]
            ],
            "size": "large"
        },
        "120": {
            "id": "120",
            "type": "date-time",
            "label": "Effective date:",
            "required": true,
            "format": "date",
            "date_format": "d/m/Y",
            "css": "wpforms-one-third",
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "2"
                    }
                ]
            ],
            "size": "large"
        },
        "121": {
            "id": "121",
            "type": "name",
            "label": "1st signatory name:",
            "required": true,
            "format": "simple",
            "css": "wpforms-one-fourth wpforms-first",
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "2"
                    }
                ]
            ],
            "size": "large"
        },
        "122": {
            "id": "122",
            "type": "number",
            "label": "ID number:",
            "required": true,
            "css": "wpforms-one-fourth",
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "2"
                    }
                ]
            ],
            "size": "large"
        },
        "123": {
            "id": "123",
            "type": "date-time",
            "label": "Date:",
            "required": true,
            "format": "date",
            "date_format": "d/m/Y",
            "css": "wpforms-one-fourth",
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "2"
                    }
                ]
            ],
            "size": "large"
        },
        "124": {
            "id": "124",
            "type": "file-upload",
            "label": "Signature:",
            "required": true,
            "max_file_number": 1,
            "css": "wpforms-one-fourth",
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "2"
                    }
                ]
            ]
        },
        "125": {
            "id": "125",
            "type": "name",
            "label": "2nd signatory name:",
            "required": true,
            "format": "simple",
            "css": "wpforms-one-fourth wpforms-first",
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "2"
                    },
                    {
                        "field": "196",
                        "operator": "==",
                        "value": "1"
                    }
                ],
                [
                    {
                        "field": "196",
                        "operator": "==",
                        "value": "2"
                    }
                ],
                [
                    {
                        "field": "196",
                        "operator": "==",
                        "value": "3"
                    }
                ]
            ],
            "size": "large"
        },
        "126": {
            "id": "126",
            "type": "number",
            "label": "ID number:",
            "required": true,
            "css": "wpforms-one-fourth",
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "2"
                    },
                    {
                        "field": "196",
                        "operator": "==",
                        "value": "1"
                    }
                ],
                [
                    {
                        "field": "196",
                        "operator": "==",
                        "value": "2"
                    }
                ],
                [
                    {
                        "field": "196",
                        "operator": "==",
                        "value": "3"
                    }
                ]
            ],
            "size": "large"
        },
        "127": {
            "id": "127",
            "type": "date-time",
            "label": "Date:",
            "required": true,
            "format": "date",
            "date_format": "d/m/Y",
            "css": "wpforms-one-fourth",
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "2"
                    },
                    {
                        "field": "196",
                        "operator": "==",
                        "value": "1"
                    }
                ],
                [
                    {
                        "field": "196",
                        "operator": "==",
                        "value": "2"
                    }
                ],
                [
                    {
                        "field": "196",
                        "operator": "==",
                        "value": "3"
                    }
                ]
            ],
            "size": "large"
        },
        "128": {
            "id": "128",
            "type": "file-upload",
            "label": "Signature:",
            "required": true,
            "max_file_number": 1,
            "css": "wpforms-one-fourth",
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "2"
                    },
                    {
                        "field": "196",
                        "operator": "==",
                        "value": "1"
                    }
                ],
                [
                    {
                        "field": "196",
                        "operator": "==",
                        "value": "2"
                    }
                ],
                [
                    {
                        "field": "196",
                        "operator": "==",
                        "value": "3"
                    }
                ]
            ]
        },
        "129": {
            "id": "129",
            "type": "name",
            "label": "3rd signatory name:",
            "required": true,
            "format": "simple",
            "css": "wpforms-one-fourth wpforms-first",
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "2"
                    },
                    {
                        "field": "196",
                        "operator": "==",
                        "value": "2"
                    }
                ],
                [
                    {
                        "field": "196",
                        "operator": "==",
                        "value": "3"
                    }
                ]
            ],
            "size": "large"
        },
        "130": {
            "id": "130",
            "type": "number",
            "label": "ID number:",
            "required": true,
            "css": "wpforms-one-fourth",
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "2"
                    },
                    {
                        "field": "196",
                        "operator": "==",
                        "value": "2"
                    }
                ],
                [
                    {
                        "field": "196",
                        "operator": "==",
                        "value": "3"
                    }
                ]
            ],
            "size": "large"
        },
        "131": {
            "id": "131",
            "type": "date-time",
            "label": "Date:",
            "required": true,
            "format": "date",
            "date_format": "d/m/Y",
            "css": "wpforms-one-fourth",
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "2"
                    },
                    {
                        "field": "196",
                        "operator": "==",
                        "value": "2"
                    }
                ],
                [
                    {
                        "field": "196",
                        "operator": "==",
                        "value": "3"
                    }
                ]
            ],
            "size": "large"
        },
        "132": {
            "id": "132",
            "type": "file-upload",
            "label": "Signature:",
            "required": true,
            "max_file_number": 1,
            "css": "wpforms-one-fourth",
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "2"
                    },
                    {
                        "field": "196",
                        "operator": "==",
                        "value": "2"
                    }
                ],
                [
                    {
                        "field": "196",
                        "operator": "==",
                        "value": "3"
                    }
                ]
            ]
        },
        "133": {
            "id": "133",
            "type": "name",
            "label": "4th signatory name:",
            "required": true,
            "format": "simple",
            "css": "wpforms-one-fourth wpforms-first",
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "2"
                    },
                    {
                        "field": "196",
                        "operator": "==",
                        "value": "3"
                    }
                ]
            ],
            "size": "large"
        },
        "134": {
            "id": "134",
            "type": "number",
            "label": "ID number:",
            "required": true,
            "css": "wpforms-one-fourth",
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "2"
                    },
                    {
                        "field": "196",
                        "operator": "==",
                        "value": "3"
                    }
                ]
            ],
            "size": "large"
        },
        "135": {
            "id": "135",
            "type": "date-time",
            "label": "Date:",
            "required": true,
            "format": "date",
            "date_format": "d/m/Y",
            "css": "wpforms-one-fourth",
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "2"
                    },
                    {
                        "field": "196",
                        "operator": "==",
                        "value": "3"
                    }
                ]
            ],
            "size": "large"
        },
        "136": {
            "id": "136",
            "type": "file-upload",
            "label": "Signature:",
            "required": true,
            "max_file_number": 1,
            "css": "wpforms-one-fourth",
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "2"
                    },
                    {
                        "field": "196",
                        "operator": "==",
                        "value": "3"
                    }
                ]
            ]
        },
        "137": {
            "id": "137",
            "type": "name",
            "label": "Witnessed by (name):",
            "required": true,
            "format": "simple",
            "css": "wpforms-one-fourth wpforms-first",
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "2"
                    }
                ]
            ],
            "size": "large"
        },
        "138": {
            "id": "138",
            "type": "number",
            "label": "ID number:",
            "required": true,
            "css": "wpforms-one-fourth",
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "2"
                    }
                ]
            ],
            "size": "large"
        },
        "139": {
            "id": "139",
            "type": "date-time",
            "label": "Date:",
            "required": true,
            "format": "date",
            "date_format": "d/m/Y",
            "css": "wpforms-one-fourth",
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "2"
                    }
                ]
            ],
            "size": "large"
        },
        "140": {
            "id": "140",
            "type": "file-upload",
            "label": "Signature:",
            "required": true,
            "max_file_number": 1,
            "css": "wpforms-one-fourth",
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "2"
                    }
                ]
            ]
        },
        "141": {
            "id": "141",
            "type": "divider",
            "label": "Corporate/Group Application:",
            "required": false,
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "3"
                    }
                ]
            ],
            "label_disable": true
        },
        "142": {
            "id": "142",
            "type": "name",
            "label": "Name of group/institution:",
            "required": true,
            "format": "simple",
            "css": "wpforms-two-fourths wpforms-first",
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "3"
                    }
                ]
            ],
            "size": "large"
        },
        "146": {
            "id": "146",
            "type": "select",
            "label": "Type of organization:",
            "required": true,
            "placeholder": "- Select Type -",
            "choices": [
                {
                    "value": "1",
                    "label": "Group"
                },
                {
                    "value": "2",
                    "label": "Association"
                },
                {
                    "value": "3",
                    "label": "Partnership"
                },
                {
                    "value": "4",
                    "label": "Company"
                },
                {
                    "value": "5",
                    "label": "Other"
                }
            ],
            "css": "wpforms-one-fourth",
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "3"
                    }
                ]
            ],
            "size": "large"
        },
        "144": {
            "id": "144",
            "type": "text",
            "label": "If other, specify:",
            "required": true,
            "limit_count": 1,
            "limit_mode": "characters",
            "css": "wpforms-one-fourth",
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "3"
                    },
                    {
                        "field": "146",
                        "operator": "==",
                        "value": "5"
                    }
                ]
            ],
            "size": "large"
        },
        "147": {
            "id": "147",
            "type": "text",
            "label": "Registration No:",
            "required": true,
            "limit_count": 1,
            "limit_mode": "characters",
            "css": "wpforms-one-third wpforms-first",
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "3"
                    }
                ]
            ],
            "size": "large"
        },
        "148": {
            "id": "148",
            "type": "date-time",
            "label": "Date of Registration/Incorporation:",
            "required": true,
            "format": "date",
            "date_format": "d/m/Y",
            "css": "wpforms-one-third",
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "3"
                    }
                ]
            ],
            "size": "large"
        },
        "150": {
            "id": "150",
            "type": "divider",
            "label": "Registered Offices:",
            "required": false,
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "3"
                    }
                ]
            ],
            "label_disable": true
        },
        "149": {
            "id": "149",
            "type": "text",
            "label": "Postal Address",
            "required": true,
            "limit_count": 1,
            "limit_mode": "characters",
            "css": "wpforms-one-third wpforms-first",
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "3"
                    }
                ]
            ],
            "size": "large"
        },
        "152": {
            "id": "152",
            "type": "number",
            "label": "Code",
            "required": true,
            "css": "wpforms-one-third",
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "3"
                    }
                ]
            ],
            "size": "large"
        },
        "153": {
            "id": "153",
            "type": "text",
            "label": "Town",
            "required": true,
            "limit_count": 1,
            "limit_mode": "characters",
            "css": "wpforms-one-third",
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "3"
                    }
                ]
            ],
            "size": "large"
        },
        "154": {
            "id": "154",
            "type": "phone",
            "label": "Office Phone/Mobile Number:",
            "required": true,
            "format": "smart",
            "css": "wpforms-one-half wpforms-first",
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "3"
                    }
                ]
            ],
            "size": "large"
        },
        "155": {
            "id": "155",
            "type": "email",
            "label": "Office Email:",
            "required": true,
            "css": "wpforms-one-half",
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "3"
                    }
                ]
            ],
            "size": "large"
        },
        "156": {
            "id": "156",
            "type": "name",
            "label": "Contact Person:",
            "required": true,
            "format": "simple",
            "css": "wpforms-one-half wpforms-first",
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "3"
                    }
                ]
            ],
            "size": "large"
        },
        "157": {
            "id": "157",
            "type": "phone",
            "label": "Mobile Number:",
            "required": true,
            "format": "smart",
            "css": "wpforms-one-half",
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "3"
                    }
                ]
            ],
            "size": "large"
        },
        "158": {
            "id": "158",
            "type": "text",
            "label": "Physical Address(Building Name):",
            "required": true,
            "limit_count": 1,
            "limit_mode": "characters",
            "css": "wpforms-one-half wpforms-first",
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "3"
                    }
                ]
            ],
            "size": "large"
        },
        "159": {
            "id": "159",
            "type": "text",
            "label": "Street:",
            "required": true,
            "limit_count": 1,
            "limit_mode": "characters",
            "css": "wpforms-one-half",
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "3"
                    }
                ]
            ],
            "size": "large"
        },
        "160": {
            "id": "160",
            "type": "text",
            "label": "Nature of Business:",
            "required": true,
            "limit_count": 1,
            "limit_mode": "characters",
            "css": "wpforms-one-half wpforms-first",
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "3"
                    }
                ]
            ],
            "size": "large"
        },
        "161": {
            "id": "161",
            "type": "radio",
            "label": "Purpose of account opening:",
            "required": true,
            "choices": [
                {
                    "value": "1",
                    "label": "Investment"
                },
                {
                    "value": "2",
                    "label": "Transaction"
                },
                {
                    "value": "3",
                    "label": "Savings & Borrowing"
                }
            ],
            "css": "wpforms-one-half",
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "3"
                    }
                ]
            ],
            "input_columns": "inline"
        },
        "162": {
            "id": "162",
            "type": "radio",
            "label": "Sources of funds to the account:",
            "required": true,
            "choices": [
                {
                    "value": "1",
                    "label": "Business Income"
                },
                {
                    "value": "2",
                    "label": "Shareholder Contributions"
                },
                {
                    "value": "3",
                    "label": "Borrowing"
                },
                {
                    "value": "4",
                    "label": "Income Investments"
                },
                {
                    "value": "5",
                    "label": "Others (Specify)"
                }
            ],
            "css": "wpforms-one-half wpforms-first",
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "3"
                    }
                ]
            ],
            "input_columns": "inline"
        },
        "163": {
            "id": "163",
            "type": "text",
            "label": "Others (Specify):",
            "required": true,
            "limit_count": 1,
            "limit_mode": "characters",
            "css": "wpforms-one-half",
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "3"
                    },
                    {
                        "field": "162",
                        "operator": "==",
                        "value": "5"
                    }
                ]
            ],
            "size": "large"
        },
        "210": {
            "id": "210",
            "type": "file-upload",
            "label": "Attach Group/Company Registration Certificate:",
            "required": true,
            "max_file_number": 1,
            "css": "wpforms-one-third wpforms-first",
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "3"
                    }
                ]
            ]
        },
        "178": {
            "id": "178",
            "type": "divider",
            "label": "Names of Directors/Officials:",
            "required": false,
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "3"
                    }
                ]
            ],
            "label_disable": true
        },
        "197": {
            "id": "197",
            "type": "select",
            "label": "How many directors/officials does the company/group have?",
            "required": true,
            "placeholder": "- Select No. -",
            "choices": [
                {
                    "value": "1",
                    "label": "2"
                },
                {
                    "value": "2",
                    "label": "3"
                },
                {
                    "value": "3",
                    "label": "4"
                }
            ],
            "css": "wpforms-one-third wpforms-first",
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "3"
                    }
                ]
            ],
            "size": "large"
        },
        "174": {
            "id": "174",
            "type": "name",
            "label": "1st director/official name:",
            "required": true,
            "format": "simple",
            "css": "wpforms-one-third wpforms-first",
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "3"
                    }
                ]
            ],
            "size": "large"
        },
        "175": {
            "id": "175",
            "type": "number",
            "label": "ID number:",
            "required": true,
            "css": "wpforms-one-third",
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "3"
                    }
                ]
            ],
            "size": "large"
        },
        "184": {
            "id": "184",
            "type": "text",
            "label": "Post held:",
            "required": true,
            "limit_count": 1,
            "limit_mode": "characters",
            "css": "wpforms-one-third",
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "3"
                    }
                ]
            ],
            "size": "large"
        },
        "179": {
            "id": "179",
            "type": "name",
            "label": "2nd director/official name:",
            "required": true,
            "format": "simple",
            "css": "wpforms-one-third wpforms-first",
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "3"
                    },
                    {
                        "field": "197",
                        "operator": "==",
                        "value": "1"
                    }
                ],
                [
                    {
                        "field": "197",
                        "operator": "==",
                        "value": "2"
                    }
                ],
                [
                    {
                        "field": "197",
                        "operator": "==",
                        "value": "3"
                    }
                ]
            ],
            "size": "large"
        },
        "185": {
            "id": "185",
            "type": "number",
            "label": "ID number:",
            "required": true,
            "css": "wpforms-one-third",
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "3"
                    },
                    {
                        "field": "197",
                        "operator": "==",
                        "value": "1"
                    }
                ],
                [
                    {
                        "field": "197",
                        "operator": "==",
                        "value": "2"
                    }
                ],
                [
                    {
                        "field": "197",
                        "operator": "==",
                        "value": "3"
                    }
                ]
            ],
            "size": "large"
        },
        "186": {
            "id": "186",
            "type": "text",
            "label": "Post held:",
            "required": true,
            "limit_count": 1,
            "limit_mode": "characters",
            "css": "wpforms-one-third",
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "3"
                    },
                    {
                        "field": "197",
                        "operator": "==",
                        "value": "1"
                    }
                ],
                [
                    {
                        "field": "197",
                        "operator": "==",
                        "value": "2"
                    }
                ],
                [
                    {
                        "field": "197",
                        "operator": "==",
                        "value": "3"
                    }
                ]
            ],
            "size": "large"
        },
        "198": {
            "id": "198",
            "type": "name",
            "label": "3rd director/official name:",
            "required": true,
            "format": "simple",
            "css": "wpforms-one-third wpforms-first",
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "3"
                    },
                    {
                        "field": "197",
                        "operator": "==",
                        "value": "2"
                    }
                ],
                [
                    {
                        "field": "197",
                        "operator": "==",
                        "value": "3"
                    }
                ]
            ],
            "size": "large"
        },
        "199": {
            "id": "199",
            "type": "number",
            "label": "ID number:",
            "required": true,
            "css": "wpforms-one-third",
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "3"
                    },
                    {
                        "field": "197",
                        "operator": "==",
                        "value": "2"
                    }
                ],
                [
                    {
                        "field": "197",
                        "operator": "==",
                        "value": "3"
                    }
                ]
            ],
            "size": "large"
        },
        "200": {
            "id": "200",
            "type": "text",
            "label": "Post held:",
            "required": true,
            "limit_count": 1,
            "limit_mode": "characters",
            "css": "wpforms-one-third",
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "3"
                    },
                    {
                        "field": "197",
                        "operator": "==",
                        "value": "2"
                    }
                ],
                [
                    {
                        "field": "197",
                        "operator": "==",
                        "value": "3"
                    }
                ]
            ],
            "size": "large"
        },
        "201": {
            "id": "201",
            "type": "name",
            "label": "4th director/official name:",
            "required": true,
            "format": "simple",
            "css": "wpforms-one-third wpforms-first",
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "3"
                    },
                    {
                        "field": "197",
                        "operator": "==",
                        "value": "3"
                    }
                ]
            ],
            "size": "large"
        },
        "202": {
            "id": "202",
            "type": "number",
            "label": "ID number:",
            "required": true,
            "css": "wpforms-one-third",
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "3"
                    },
                    {
                        "field": "197",
                        "operator": "==",
                        "value": "3"
                    }
                ]
            ],
            "size": "large"
        },
        "203": {
            "id": "203",
            "type": "text",
            "label": "Post held:",
            "required": true,
            "limit_count": 1,
            "limit_mode": "characters",
            "css": "wpforms-one-third",
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "3"
                    },
                    {
                        "field": "197",
                        "operator": "==",
                        "value": "3"
                    }
                ]
            ],
            "size": "large"
        },
        "180": {
            "id": "180",
            "type": "divider",
            "label": "Signatories:",
            "required": false,
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "3"
                    }
                ]
            ],
            "label_disable": true
        },
        "181": {
            "id": "181",
            "type": "name",
            "label": "1st signatory name:",
            "required": true,
            "format": "simple",
            "css": "wpforms-one-fourth wpforms-first",
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "3"
                    }
                ]
            ],
            "size": "large"
        },
        "182": {
            "id": "182",
            "type": "number",
            "label": "ID number:",
            "required": true,
            "css": "wpforms-one-fourth",
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "3"
                    }
                ]
            ],
            "size": "large"
        },
        "176": {
            "id": "176",
            "type": "date-time",
            "label": "Date:",
            "required": true,
            "format": "date",
            "date_format": "d/m/Y",
            "css": "wpforms-one-fourth",
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "3"
                    }
                ]
            ],
            "size": "large"
        },
        "183": {
            "id": "183",
            "type": "file-upload",
            "label": "Signature:",
            "required": true,
            "max_file_number": 1,
            "css": "wpforms-one-fourth",
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "3"
                    }
                ]
            ]
        },
        "187": {
            "id": "187",
            "type": "name",
            "label": "2nd signatory name:",
            "required": true,
            "format": "simple",
            "css": "wpforms-one-fourth wpforms-first",
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "3"
                    },
                    {
                        "field": "197",
                        "operator": "==",
                        "value": "1"
                    }
                ],
                [
                    {
                        "field": "197",
                        "operator": "==",
                        "value": "2"
                    }
                ],
                [
                    {
                        "field": "197",
                        "operator": "==",
                        "value": "3"
                    }
                ]
            ],
            "size": "large"
        },
        "188": {
            "id": "188",
            "type": "number",
            "label": "ID number:",
            "required": true,
            "css": "wpforms-one-fourth",
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "3"
                    },
                    {
                        "field": "197",
                        "operator": "==",
                        "value": "1"
                    }
                ],
                [
                    {
                        "field": "197",
                        "operator": "==",
                        "value": "2"
                    }
                ],
                [
                    {
                        "field": "197",
                        "operator": "==",
                        "value": "3"
                    }
                ]
            ],
            "size": "large"
        },
        "189": {
            "id": "189",
            "type": "date-time",
            "label": "Date:",
            "required": true,
            "format": "date",
            "date_format": "d/m/Y",
            "css": "wpforms-one-fourth",
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "3"
                    },
                    {
                        "field": "197",
                        "operator": "==",
                        "value": "1"
                    }
                ],
                [
                    {
                        "field": "197",
                        "operator": "==",
                        "value": "2"
                    }
                ],
                [
                    {
                        "field": "197",
                        "operator": "==",
                        "value": "3"
                    }
                ]
            ],
            "size": "large"
        },
        "190": {
            "id": "190",
            "type": "file-upload",
            "label": "Signature:",
            "required": true,
            "max_file_number": 1,
            "css": "wpforms-one-fourth",
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "3"
                    },
                    {
                        "field": "197",
                        "operator": "==",
                        "value": "1"
                    }
                ],
                [
                    {
                        "field": "197",
                        "operator": "==",
                        "value": "2"
                    }
                ],
                [
                    {
                        "field": "197",
                        "operator": "==",
                        "value": "3"
                    }
                ]
            ]
        },
        "191": {
            "id": "191",
            "type": "name",
            "label": "3rd signatory name:",
            "required": true,
            "format": "simple",
            "css": "wpforms-one-fourth wpforms-first",
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "3"
                    },
                    {
                        "field": "197",
                        "operator": "==",
                        "value": "2"
                    }
                ],
                [
                    {
                        "field": "197",
                        "operator": "==",
                        "value": "3"
                    }
                ]
            ],
            "size": "large"
        },
        "192": {
            "id": "192",
            "type": "number",
            "label": "ID number:",
            "required": true,
            "css": "wpforms-one-fourth",
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "3"
                    },
                    {
                        "field": "197",
                        "operator": "==",
                        "value": "2"
                    }
                ],
                [
                    {
                        "field": "197",
                        "operator": "==",
                        "value": "3"
                    }
                ]
            ],
            "size": "large"
        },
        "193": {
            "id": "193",
            "type": "date-time",
            "label": "Date:",
            "required": true,
            "format": "date",
            "date_format": "d/m/Y",
            "css": "wpforms-one-fourth",
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "3"
                    },
                    {
                        "field": "197",
                        "operator": "==",
                        "value": "2"
                    }
                ],
                [
                    {
                        "field": "197",
                        "operator": "==",
                        "value": "3"
                    }
                ]
            ],
            "size": "large"
        },
        "194": {
            "id": "194",
            "type": "file-upload",
            "label": "Signature:",
            "required": true,
            "max_file_number": 1,
            "css": "wpforms-one-fourth",
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "3"
                    },
                    {
                        "field": "197",
                        "operator": "==",
                        "value": "2"
                    }
                ],
                [
                    {
                        "field": "197",
                        "operator": "==",
                        "value": "3"
                    }
                ]
            ]
        },
        "204": {
            "id": "204",
            "type": "name",
            "label": "4th signatory name:",
            "required": true,
            "format": "simple",
            "css": "wpforms-one-fourth wpforms-first",
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "3"
                    },
                    {
                        "field": "197",
                        "operator": "==",
                        "value": "3"
                    }
                ]
            ],
            "size": "large"
        },
        "205": {
            "id": "205",
            "type": "number",
            "label": "ID number:",
            "required": true,
            "css": "wpforms-one-fourth",
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "3"
                    },
                    {
                        "field": "197",
                        "operator": "==",
                        "value": "3"
                    }
                ]
            ],
            "size": "large"
        },
        "206": {
            "id": "206",
            "type": "date-time",
            "label": "Date:",
            "required": true,
            "format": "date",
            "date_format": "d/m/Y",
            "css": "wpforms-one-fourth",
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "3"
                    },
                    {
                        "field": "197",
                        "operator": "==",
                        "value": "3"
                    }
                ]
            ],
            "size": "large"
        },
        "207": {
            "id": "207",
            "type": "file-upload",
            "label": "Signature:",
            "required": true,
            "max_file_number": 1,
            "css": "wpforms-one-fourth",
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "3"
                    },
                    {
                        "field": "197",
                        "operator": "==",
                        "value": "3"
                    }
                ]
            ]
        },
        "214": {
            "id": "214",
            "type": "divider",
            "label": "Reference Code (Registration Fee Payment):",
            "required": false,
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "1"
                    }
                ],
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "2"
                    }
                ],
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "3"
                    }
                ]
            ],
            "label_disable": true
        },
        "215": {
            "id": "215",
            "type": "text",
            "label": "M-PESA Transaction Code:",
            "required": true,
            "placeholder": "eg. QK72G6UMYO",
            "limit_count": 10,
            "limit_mode": "characters",
            "limit_enabled": true,
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "1"
                    }
                ],
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "2"
                    }
                ],
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "3"
                    }
                ]
            ],
            "size": "medium"
        },
        "211": {
            "id": "211",
            "type": "divider",
            "label": "Recruited by (Optional):",
            "required": false,
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "1"
                    }
                ],
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "2"
                    }
                ],
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "3"
                    }
                ]
            ],
            "label_disable": true
        },
        "212": {
            "id": "212",
            "type": "name",
            "label": "Full Name:",
            "required": false,
            "format": "simple",
            "css": "wpforms-one-half wpforms-first",
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "1"
                    }
                ],
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "2"
                    }
                ],
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "3"
                    }
                ]
            ],
            "size": "large"
        },
        "213": {
            "id": "213",
            "type": "name",
            "label": "Company Code",
            "required": false,
            "format": "simple",
            "css": "wpforms-one-third wpforms-last",
            "conditional_logic": true,
            "conditional_type": "show",
            "conditionals": [
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "1"
                    }
                ],
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "2"
                    }
                ],
                [
                    {
                        "field": "28",
                        "operator": "==",
                        "value": "3"
                    }
                ]
            ],
            "size": "small"
        }
    },
    "settings": {
        "form_title": "Onboarding Form",
        "submit_text": "Submit Details",
        "submit_text_processing": "Sending...",
        "form_slug": "onboarding_form",
        "confirmation": {
            "message": "Thank you for submitting your details! We are processing your member application and will be in touch with you shortly.",
            "message_html": "<p>Thank you for submitting your details! We are processing your member application and will be in touch with you shortly.</p>"
        },
        "notifications": {
            "1": {
                "email": "onboard.msaportsacco@gmail.com",
                "subject": "New Entry: Membership Onboarding Form",
                "sender_name": "Ports Sacco Website",
                "sender_address": "wordpress@portsacco.co.ke",
                "replyto": "{field_id=\"2\"} {field_id=\"32\"} {field_id=\"84\"} {field_id=\"95\"} {field_id=\"109\"} {field_id=\"109\"} {field_id=\"109\"}",
                "message": "{all_fields}"
            },
            "2": {
                "email": "{field_id=\"2\"} {field_id=\"32\"} {field_id=\"84\"} {field_id=\"95\"} {field_id=\"109\"}",
                "subject": "Member Registration",
                "sender_name": "Ports Sacco",
                "sender_address": "wordpress@portsacco.co.ke",
                "replyto": "onboard.msaportsacco@gmail.com",
                "message": "Hello {field_id=\"1\"}, \nThank you for submitting your details.\nWe have received your details and we are processing your membership application. \nWe will be in touch soon.\n\n--\nThis automated email has been sent by the membership form on the Ports Sacco website because your email was submitted in the application. If that was not done by you then please ignore this email."
            }
        },
        "submitter_email_field_ids": [
            "2",
            "32",
            "84",
            "95",
            "109"
        ]
    }
};

export default onboardingFormSpec;
