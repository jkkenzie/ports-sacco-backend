<?php

declare(strict_types=1);

if (! defined('ABSPATH')) {
    exit;
}

/**
 * Onboarding Form specification (from WPForms template).
 *
 * @return array<string, mixed>
 */
return array (
  'slug' => 'onboarding_form',
  'name' => 'Onboarding Form',
  'field_order' => 
  array (
    0 => '28',
    1 => '48',
    2 => '5',
    3 => '1',
    4 => '17',
    5 => '16',
    6 => '11',
    7 => '18',
    8 => '2',
    9 => '15',
    10 => '14',
    11 => '19',
    12 => '38',
    13 => '20',
    14 => '41',
    15 => '42',
    16 => '43',
    17 => '44',
    18 => '68',
    19 => '46',
    20 => '47',
    21 => '21',
    22 => '49',
    23 => '63',
    24 => '52',
    25 => '208',
    26 => '54',
    27 => '59',
    28 => '57',
    29 => '58',
    30 => '60',
    31 => '61',
    32 => '62',
    33 => '64',
    34 => '65',
    35 => '66',
    36 => '67',
    37 => '69',
    38 => '71',
    39 => '72',
    40 => '73',
    41 => '74',
    42 => '75',
    43 => '76',
    44 => '77',
    45 => '78',
    46 => '196',
    47 => '50',
    48 => '29',
    49 => '30',
    50 => '33',
    51 => '37',
    52 => '32',
    53 => '31',
    54 => '36',
    55 => '35',
    56 => '34',
    57 => '39',
    58 => '79',
    59 => '80',
    60 => '81',
    61 => '82',
    62 => '83',
    63 => '84',
    64 => '85',
    65 => '86',
    66 => '87',
    67 => '88',
    68 => '89',
    69 => '90',
    70 => '91',
    71 => '92',
    72 => '93',
    73 => '94',
    74 => '95',
    75 => '96',
    76 => '97',
    77 => '98',
    78 => '99',
    79 => '100',
    80 => '101',
    81 => '114',
    82 => '113',
    83 => '112',
    84 => '110',
    85 => '109',
    86 => '108',
    87 => '107',
    88 => '105',
    89 => '104',
    90 => '103',
    91 => '115',
    92 => '116',
    93 => '117',
    94 => '118',
    95 => '119',
    96 => '120',
    97 => '121',
    98 => '122',
    99 => '123',
    100 => '124',
    101 => '125',
    102 => '126',
    103 => '127',
    104 => '128',
    105 => '129',
    106 => '130',
    107 => '131',
    108 => '132',
    109 => '133',
    110 => '134',
    111 => '135',
    112 => '136',
    113 => '137',
    114 => '138',
    115 => '139',
    116 => '140',
    117 => '141',
    118 => '142',
    119 => '146',
    120 => '144',
    121 => '147',
    122 => '148',
    123 => '150',
    124 => '149',
    125 => '152',
    126 => '153',
    127 => '154',
    128 => '155',
    129 => '156',
    130 => '157',
    131 => '158',
    132 => '159',
    133 => '160',
    134 => '161',
    135 => '162',
    136 => '163',
    137 => '210',
    138 => '178',
    139 => '197',
    140 => '174',
    141 => '175',
    142 => '184',
    143 => '179',
    144 => '185',
    145 => '186',
    146 => '198',
    147 => '199',
    148 => '200',
    149 => '201',
    150 => '202',
    151 => '203',
    152 => '180',
    153 => '181',
    154 => '182',
    155 => '176',
    156 => '183',
    157 => '187',
    158 => '188',
    159 => '189',
    160 => '190',
    161 => '191',
    162 => '192',
    163 => '193',
    164 => '194',
    165 => '204',
    166 => '205',
    167 => '206',
    168 => '207',
    169 => '214',
    170 => '215',
    171 => '211',
    172 => '212',
    173 => '213',
  ),
  'fields' => 
  array (
    28 => 
    array (
      'id' => '28',
      'type' => 'select',
      'label' => 'Select account type:',
      'required' => true,
      'placeholder' => '- Select Account Type -',
      'choices' => 
      array (
        0 => 
        array (
          'value' => '1',
          'label' => 'Individual Account',
        ),
        1 => 
        array (
          'value' => '2',
          'label' => 'Joint Account',
        ),
        2 => 
        array (
          'value' => '3',
          'label' => 'Group/Company Account',
        ),
      ),
      'css' => 'wpforms-one-third wpforms-first',
      'conditional_logic' => false,
      'size' => 'large',
    ),
    48 => 
    array (
      'id' => '48',
      'type' => 'divider',
      'label' => 'Personal Details:',
      'required' => false,
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '1',
          ),
        ),
      ),
      'label_disable' => true,
    ),
    5 => 
    array (
      'id' => '5',
      'type' => 'radio',
      'label' => 'Have you been a member before?',
      'required' => true,
      'choices' => 
      array (
        0 => 
        array (
          'value' => '1',
          'label' => 'Yes',
        ),
        1 => 
        array (
          'value' => '2',
          'label' => 'No',
        ),
      ),
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '1',
          ),
        ),
      ),
      'input_columns' => 'inline',
    ),
    1 => 
    array (
      'id' => '1',
      'type' => 'name',
      'label' => 'Your Name:',
      'required' => true,
      'format' => 'first-last',
      'css' => 'wpforms-two-thirds wpforms-firstwpforms-two-thirds wpforms-first',
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '1',
          ),
        ),
      ),
      'size' => 'large',
    ),
    17 => 
    array (
      'id' => '17',
      'type' => 'date-time',
      'label' => 'Date of Birth:',
      'required' => true,
      'format' => 'date',
      'date_format' => 'd/m/Y',
      'css' => 'wpforms-one-third',
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '1',
          ),
        ),
      ),
      'size' => 'large',
    ),
    16 => 
    array (
      'id' => '16',
      'type' => 'phone',
      'label' => 'Mobile Number:',
      'required' => true,
      'format' => 'smart',
      'css' => 'wpforms-one-third wpforms-first',
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '1',
          ),
        ),
      ),
      'size' => 'large',
    ),
    11 => 
    array (
      'id' => '11',
      'type' => 'number',
      'label' => 'Valid ID/Passport Number',
      'required' => true,
      'placeholder' => 'Enter your ID/Passport No.',
      'css' => 'wpforms-one-third',
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '1',
          ),
        ),
      ),
      'size' => 'large',
    ),
    18 => 
    array (
      'id' => '18',
      'type' => 'file-upload',
      'label' => 'Attach ID/Passport (Front & Back):',
      'required' => false,
      'max_file_number' => 2,
      'css' => 'wpforms-one-third',
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '1',
          ),
        ),
      ),
    ),
    2 => 
    array (
      'id' => '2',
      'type' => 'email',
      'label' => 'Your Email Address:',
      'required' => true,
      'css' => 'wpforms-one-third wpforms-first',
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '1',
          ),
        ),
      ),
      'size' => 'large',
    ),
    15 => 
    array (
      'id' => '15',
      'type' => 'radio',
      'label' => 'Marital status:',
      'required' => true,
      'choices' => 
      array (
        0 => 
        array (
          'value' => '1',
          'label' => 'Single',
        ),
        1 => 
        array (
          'value' => '2',
          'label' => 'Married',
        ),
      ),
      'css' => 'wpforms-one-third',
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '1',
          ),
        ),
      ),
      'input_columns' => 'inline',
    ),
    14 => 
    array (
      'id' => '14',
      'type' => 'select',
      'label' => 'Sex:',
      'required' => true,
      'placeholder' => '- Sex -',
      'choices' => 
      array (
        0 => 
        array (
          'value' => '1',
          'label' => 'Male',
        ),
        1 => 
        array (
          'value' => '2',
          'label' => 'Female',
        ),
        2 => 
        array (
          'value' => '3',
          'label' => 'Other',
        ),
      ),
      'css' => 'wpforms-one-third wpforms-last',
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '1',
          ),
        ),
      ),
      'size' => 'large',
    ),
    19 => 
    array (
      'id' => '19',
      'type' => 'text',
      'label' => 'Your KRA PIN number:',
      'required' => true,
      'limit_count' => 1,
      'limit_mode' => 'characters',
      'css' => 'wpforms-one-third wpforms-first',
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '1',
          ),
        ),
      ),
      'size' => 'large',
    ),
    38 => 
    array (
      'id' => '38',
      'type' => 'file-upload',
      'label' => 'Attach your KRA PIN Certificate:',
      'required' => true,
      'max_file_number' => 1,
      'css' => 'wpforms-one-third',
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '1',
          ),
        ),
      ),
    ),
    20 => 
    array (
      'id' => '20',
      'type' => 'file-upload',
      'label' => 'Attach Your Passport Photo:',
      'required' => true,
      'max_file_number' => 1,
      'css' => 'wpforms-one-third',
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '1',
          ),
        ),
      ),
    ),
    41 => 
    array (
      'id' => '41',
      'type' => 'number',
      'label' => 'Postal Address:',
      'required' => true,
      'css' => 'wpforms-one-third wpforms-first',
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '1',
          ),
        ),
      ),
      'size' => 'large',
    ),
    42 => 
    array (
      'id' => '42',
      'type' => 'number',
      'label' => 'Postal Code:',
      'required' => true,
      'css' => 'wpforms-one-third',
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '1',
          ),
        ),
      ),
      'size' => 'large',
    ),
    43 => 
    array (
      'id' => '43',
      'type' => 'text',
      'label' => 'Town:',
      'required' => true,
      'limit_count' => 1,
      'limit_mode' => 'characters',
      'css' => 'wpforms-one-third',
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '1',
          ),
        ),
      ),
      'size' => 'large',
    ),
    44 => 
    array (
      'id' => '44',
      'type' => 'text',
      'label' => 'Residence:',
      'required' => true,
      'limit_count' => 1,
      'limit_mode' => 'characters',
      'css' => 'wpforms-one-fourth wpforms-first',
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '1',
          ),
        ),
      ),
      'size' => 'large',
    ),
    68 => 
    array (
      'id' => '68',
      'type' => 'select',
      'label' => 'County',
      'required' => true,
      'placeholder' => '- Select County -',
      'choices' => 
      array (
        0 => 
        array (
          'value' => '4',
          'label' => 'Baringo',
        ),
        1 => 
        array (
          'value' => '5',
          'label' => 'Bomet',
        ),
        2 => 
        array (
          'value' => '6',
          'label' => 'Bungoma',
        ),
        3 => 
        array (
          'value' => '7',
          'label' => 'Busia',
        ),
        4 => 
        array (
          'value' => '8',
          'label' => 'Elgeyo-Marakwet',
        ),
        5 => 
        array (
          'value' => '9',
          'label' => 'Embu',
        ),
        6 => 
        array (
          'value' => '10',
          'label' => 'Garissa',
        ),
        7 => 
        array (
          'value' => '11',
          'label' => 'Homa Bay',
        ),
        8 => 
        array (
          'value' => '12',
          'label' => 'Isiolo',
        ),
        9 => 
        array (
          'value' => '13',
          'label' => 'Kajiado',
        ),
        10 => 
        array (
          'value' => '14',
          'label' => 'Kakamega',
        ),
        11 => 
        array (
          'value' => '15',
          'label' => 'Kericho',
        ),
        12 => 
        array (
          'value' => '16',
          'label' => 'Kiambu',
        ),
        13 => 
        array (
          'value' => '17',
          'label' => 'Kilifi',
        ),
        14 => 
        array (
          'value' => '18',
          'label' => 'Kirinyaga',
        ),
        15 => 
        array (
          'value' => '19',
          'label' => 'Kisii',
        ),
        16 => 
        array (
          'value' => '20',
          'label' => 'Kisumu',
        ),
        17 => 
        array (
          'value' => '21',
          'label' => 'Kitui',
        ),
        18 => 
        array (
          'value' => '22',
          'label' => 'Kwale',
        ),
        19 => 
        array (
          'value' => '23',
          'label' => 'Laikipia',
        ),
        20 => 
        array (
          'value' => '24',
          'label' => 'Lamu',
        ),
        21 => 
        array (
          'value' => '25',
          'label' => 'Machakos',
        ),
        22 => 
        array (
          'value' => '26',
          'label' => 'Makueni',
        ),
        23 => 
        array (
          'value' => '27',
          'label' => 'Mandera',
        ),
        24 => 
        array (
          'value' => '28',
          'label' => 'Marsabit',
        ),
        25 => 
        array (
          'value' => '29',
          'label' => 'Meru',
        ),
        26 => 
        array (
          'value' => '30',
          'label' => 'Migori',
        ),
        27 => 
        array (
          'value' => '31',
          'label' => 'Mombasa',
        ),
        28 => 
        array (
          'value' => '32',
          'label' => 'Murang’a',
        ),
        29 => 
        array (
          'value' => '33',
          'label' => 'Nairobi',
        ),
        30 => 
        array (
          'value' => '34',
          'label' => 'Nakuru',
        ),
        31 => 
        array (
          'value' => '35',
          'label' => 'Nandi',
        ),
        32 => 
        array (
          'value' => '36',
          'label' => 'Narok',
        ),
        33 => 
        array (
          'value' => '37',
          'label' => 'Nyamira',
        ),
        34 => 
        array (
          'value' => '38',
          'label' => 'Nyandarua',
        ),
        35 => 
        array (
          'value' => '39',
          'label' => 'Nyeri',
        ),
        36 => 
        array (
          'value' => '40',
          'label' => 'Samburu',
        ),
        37 => 
        array (
          'value' => '41',
          'label' => 'Siaya',
        ),
        38 => 
        array (
          'value' => '42',
          'label' => 'Taita Taveta',
        ),
        39 => 
        array (
          'value' => '43',
          'label' => 'Tana River',
        ),
        40 => 
        array (
          'value' => '44',
          'label' => 'Tharaka-Nithi',
        ),
        41 => 
        array (
          'value' => '45',
          'label' => 'Trans-Nzoia',
        ),
        42 => 
        array (
          'value' => '46',
          'label' => 'Turkana',
        ),
        43 => 
        array (
          'value' => '47',
          'label' => 'Uasin Gishu',
        ),
        44 => 
        array (
          'value' => '48',
          'label' => 'Vihiga',
        ),
        45 => 
        array (
          'value' => '49',
          'label' => 'Wajir',
        ),
        46 => 
        array (
          'value' => '50',
          'label' => 'West Pokot',
        ),
      ),
      'css' => 'wpforms-one-fourth',
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '1',
          ),
        ),
      ),
      'size' => 'large',
    ),
    46 => 
    array (
      'id' => '46',
      'type' => 'text',
      'label' => 'Sub-county:',
      'required' => false,
      'limit_count' => 1,
      'limit_mode' => 'characters',
      'css' => 'wpforms-one-fourth',
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '1',
          ),
        ),
      ),
      'size' => 'large',
    ),
    47 => 
    array (
      'id' => '47',
      'type' => 'text',
      'label' => 'Ward:',
      'required' => false,
      'limit_count' => 1,
      'limit_mode' => 'characters',
      'css' => 'wpforms-one-fourth',
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '1',
          ),
        ),
      ),
      'size' => 'large',
    ),
    21 => 
    array (
      'id' => '21',
      'type' => 'file-upload',
      'label' => 'Attach Your Signature:',
      'required' => true,
      'max_file_number' => 1,
      'css' => 'wpforms-one-third wpforms-first',
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '1',
          ),
        ),
      ),
    ),
    49 => 
    array (
      'id' => '49',
      'type' => 'divider',
      'label' => 'Employment Details:',
      'required' => false,
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '1',
          ),
        ),
      ),
      'label_disable' => true,
    ),
    63 => 
    array (
      'id' => '63',
      'type' => 'radio',
      'label' => 'Employment type:',
      'required' => true,
      'choices' => 
      array (
        0 => 
        array (
          'value' => '1',
          'label' => 'Employed',
        ),
        1 => 
        array (
          'value' => '2',
          'label' => 'Business',
        ),
      ),
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '1',
          ),
        ),
      ),
      'input_columns' => 'inline',
    ),
    52 => 
    array (
      'id' => '52',
      'type' => 'text',
      'label' => 'Employer:',
      'required' => true,
      'limit_count' => 1,
      'limit_mode' => 'characters',
      'css' => 'wpforms-one-third wpforms-first',
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '1',
          ),
          1 => 
          array (
            'field' => '63',
            'operator' => '==',
            'value' => '1',
          ),
        ),
      ),
      'size' => 'large',
    ),
    208 => 
    array (
      'id' => '208',
      'type' => 'text',
      'label' => 'Employer Address:',
      'required' => true,
      'limit_count' => 1,
      'limit_mode' => 'characters',
      'css' => 'wpforms-two-thirds',
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '1',
          ),
          1 => 
          array (
            'field' => '63',
            'operator' => '==',
            'value' => '1',
          ),
        ),
      ),
      'size' => 'large',
    ),
    54 => 
    array (
      'id' => '54',
      'type' => 'text',
      'label' => 'Designation:',
      'required' => true,
      'limit_count' => 1,
      'limit_mode' => 'characters',
      'css' => 'wpforms-one-half wpforms-first',
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '1',
          ),
          1 => 
          array (
            'field' => '63',
            'operator' => '==',
            'value' => '1',
          ),
        ),
      ),
      'size' => 'large',
    ),
    59 => 
    array (
      'id' => '59',
      'type' => 'radio',
      'label' => 'Employment terms:',
      'required' => true,
      'choices' => 
      array (
        0 => 
        array (
          'value' => '1',
          'label' => 'Permanent',
        ),
        1 => 
        array (
          'value' => '2',
          'label' => 'Contract',
        ),
        2 => 
        array (
          'value' => '3',
          'label' => 'Casual',
        ),
      ),
      'css' => 'wpforms-one-half',
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '1',
          ),
          1 => 
          array (
            'field' => '63',
            'operator' => '==',
            'value' => '1',
          ),
        ),
      ),
      'input_columns' => 'inline',
    ),
    57 => 
    array (
      'id' => '57',
      'type' => 'text',
      'label' => 'Staff/check number:',
      'required' => false,
      'limit_count' => 1,
      'limit_mode' => 'characters',
      'css' => 'wpforms-one-third wpforms-first',
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '1',
          ),
          1 => 
          array (
            'field' => '63',
            'operator' => '==',
            'value' => '1',
          ),
        ),
      ),
      'size' => 'large',
    ),
    58 => 
    array (
      'id' => '58',
      'type' => 'text',
      'label' => 'Workstation:',
      'required' => false,
      'limit_count' => 1,
      'limit_mode' => 'characters',
      'css' => 'wpforms-one-third',
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '1',
          ),
          1 => 
          array (
            'field' => '63',
            'operator' => '==',
            'value' => '1',
          ),
        ),
      ),
      'size' => 'large',
    ),
    60 => 
    array (
      'id' => '60',
      'type' => 'date-time',
      'label' => 'Specify contract end date:',
      'required' => true,
      'format' => 'date',
      'date_format' => 'd/m/Y',
      'css' => 'wpforms-one-third',
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '1',
          ),
          1 => 
          array (
            'field' => '59',
            'operator' => '==',
            'value' => '2',
          ),
          2 => 
          array (
            'field' => '63',
            'operator' => '==',
            'value' => '1',
          ),
        ),
      ),
      'size' => 'large',
    ),
    61 => 
    array (
      'id' => '61',
      'type' => 'text',
      'label' => 'Pensioner (name of former employer):',
      'required' => true,
      'limit_count' => 1,
      'limit_mode' => 'characters',
      'css' => 'wpforms-one-third',
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '1',
          ),
          1 => 
          array (
            'field' => '59',
            'operator' => '==',
            'value' => '1',
          ),
          2 => 
          array (
            'field' => '63',
            'operator' => '==',
            'value' => '1',
          ),
        ),
      ),
      'size' => 'large',
    ),
    62 => 
    array (
      'id' => '62',
      'type' => 'text',
      'label' => 'Staff pension number:',
      'required' => true,
      'limit_count' => 1,
      'limit_mode' => 'characters',
      'css' => 'wpforms-one-third wpforms-first',
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '1',
          ),
          1 => 
          array (
            'field' => '59',
            'operator' => '==',
            'value' => '1',
          ),
          2 => 
          array (
            'field' => '63',
            'operator' => '==',
            'value' => '1',
          ),
        ),
      ),
      'size' => 'large',
    ),
    64 => 
    array (
      'id' => '64',
      'type' => 'text',
      'label' => 'Business name:',
      'required' => true,
      'limit_count' => 1,
      'limit_mode' => 'characters',
      'css' => 'wpforms-one-half wpforms-first',
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '1',
          ),
          1 => 
          array (
            'field' => '63',
            'operator' => '==',
            'value' => '2',
          ),
        ),
      ),
      'size' => 'large',
    ),
    65 => 
    array (
      'id' => '65',
      'type' => 'text',
      'label' => 'Nature of business:',
      'required' => true,
      'limit_count' => 1,
      'limit_mode' => 'characters',
      'css' => 'wpforms-one-half',
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '1',
          ),
          1 => 
          array (
            'field' => '63',
            'operator' => '==',
            'value' => '2',
          ),
        ),
      ),
      'size' => 'large',
    ),
    66 => 
    array (
      'id' => '66',
      'type' => 'text',
      'label' => 'Business address:',
      'required' => true,
      'limit_count' => 1,
      'limit_mode' => 'characters',
      'css' => 'wpforms-one-half wpforms-first',
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '1',
          ),
          1 => 
          array (
            'field' => '63',
            'operator' => '==',
            'value' => '2',
          ),
        ),
      ),
      'size' => 'large',
    ),
    67 => 
    array (
      'id' => '67',
      'type' => 'text',
      'label' => 'Business location:',
      'required' => true,
      'limit_count' => 1,
      'limit_mode' => 'characters',
      'css' => 'wpforms-one-half',
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '1',
          ),
          1 => 
          array (
            'field' => '63',
            'operator' => '==',
            'value' => '2',
          ),
        ),
      ),
      'size' => 'large',
    ),
    69 => 
    array (
      'id' => '69',
      'type' => 'divider',
      'label' => 'Monthly Contributions:',
      'required' => false,
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '1',
          ),
        ),
      ),
      'label_disable' => true,
    ),
    71 => 
    array (
      'id' => '71',
      'type' => 'number',
      'label' => 'Propose monthly contributions (KSH):',
      'required' => true,
      'css' => 'wpforms-one-half wpforms-first',
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '1',
          ),
        ),
      ),
      'size' => 'large',
    ),
    72 => 
    array (
      'id' => '72',
      'type' => 'text',
      'label' => 'Amount in words:',
      'required' => true,
      'limit_count' => 1,
      'limit_mode' => 'characters',
      'css' => 'wpforms-one-half',
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '1',
          ),
        ),
      ),
      'size' => 'large',
    ),
    73 => 
    array (
      'id' => '73',
      'type' => 'checkbox',
      'label' => 'Proposed mode of remittance:',
      'required' => true,
      'choices' => 
      array (
        0 => 
        array (
          'value' => '1',
          'label' => 'Check Off',
        ),
        1 => 
        array (
          'value' => '2',
          'label' => 'Standing Order',
        ),
        2 => 
        array (
          'value' => '3',
          'label' => 'Direct Debit',
        ),
        3 => 
        array (
          'value' => '4',
          'label' => 'Other',
        ),
      ),
      'css' => 'wpforms-one-third wpforms-first',
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '1',
          ),
        ),
      ),
      'input_columns' => 'inline',
    ),
    74 => 
    array (
      'id' => '74',
      'type' => 'text',
      'label' => 'If other, specify:',
      'required' => true,
      'limit_count' => 1,
      'limit_mode' => 'characters',
      'css' => 'wpforms-one-third',
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '1',
          ),
          1 => 
          array (
            'field' => '73',
            'operator' => '==',
            'value' => '4',
          ),
        ),
      ),
      'size' => 'large',
    ),
    75 => 
    array (
      'id' => '75',
      'type' => 'date-time',
      'label' => 'Effective date:',
      'required' => true,
      'format' => 'date',
      'date_format' => 'd/m/Y',
      'css' => 'wpforms-one-third',
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '1',
          ),
        ),
      ),
      'size' => 'large',
    ),
    76 => 
    array (
      'id' => '76',
      'type' => 'name',
      'label' => 'Next of kin name',
      'required' => true,
      'format' => 'first-last',
      'css' => 'wpforms-one-third wpforms-first',
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '1',
          ),
        ),
      ),
      'size' => 'large',
    ),
    77 => 
    array (
      'id' => '77',
      'type' => 'text',
      'label' => 'Relationship:',
      'required' => true,
      'limit_count' => 1,
      'limit_mode' => 'characters',
      'css' => 'wpforms-one-third',
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '1',
          ),
        ),
      ),
      'size' => 'large',
    ),
    78 => 
    array (
      'id' => '78',
      'type' => 'phone',
      'label' => 'Mobile Number:',
      'required' => true,
      'format' => 'smart',
      'css' => 'wpforms-one-third',
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '1',
          ),
        ),
      ),
      'size' => 'large',
    ),
    196 => 
    array (
      'id' => '196',
      'type' => 'select',
      'label' => 'How many partners are you?',
      'required' => true,
      'placeholder' => '- Select No -',
      'choices' => 
      array (
        0 => 
        array (
          'value' => '1',
          'label' => '2',
        ),
        1 => 
        array (
          'value' => '2',
          'label' => '3',
        ),
        2 => 
        array (
          'value' => '3',
          'label' => '4',
        ),
      ),
      'css' => 'wpforms-one-third wpforms-first',
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '2',
          ),
        ),
      ),
      'size' => 'large',
    ),
    50 => 
    array (
      'id' => '50',
      'type' => 'divider',
      'label' => 'Partner 1 Personal Details:',
      'required' => false,
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '2',
          ),
        ),
      ),
      'label_disable' => true,
    ),
    29 => 
    array (
      'id' => '29',
      'type' => 'name',
      'label' => 'Your name:',
      'required' => true,
      'format' => 'first-last',
      'css' => 'w wpforms-two-thirds wpforms-first',
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '2',
          ),
        ),
      ),
      'size' => 'large',
    ),
    30 => 
    array (
      'id' => '30',
      'type' => 'date-time',
      'label' => 'Date of birth:',
      'required' => true,
      'format' => 'date',
      'date_format' => 'd/m/Y',
      'css' => 'wpforms-one-third',
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '2',
          ),
        ),
      ),
      'size' => 'large',
    ),
    33 => 
    array (
      'id' => '33',
      'type' => 'select',
      'label' => 'Sex:',
      'required' => true,
      'placeholder' => '- Sex -',
      'choices' => 
      array (
        0 => 
        array (
          'value' => '1',
          'label' => 'Male',
        ),
        1 => 
        array (
          'value' => '2',
          'label' => 'Female',
        ),
        2 => 
        array (
          'value' => '3',
          'label' => 'Other',
        ),
      ),
      'css' => 'wpforms-one-fourth wpforms-first',
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '2',
          ),
        ),
      ),
      'size' => 'large',
    ),
    37 => 
    array (
      'id' => '37',
      'type' => 'phone',
      'label' => 'Mobile Number:',
      'required' => true,
      'format' => 'smart',
      'css' => 'wpforms-one-fourth',
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '2',
          ),
        ),
      ),
      'size' => 'large',
    ),
    32 => 
    array (
      'id' => '32',
      'type' => 'email',
      'label' => 'Email address:',
      'required' => true,
      'css' => 'wpforms-one-fourth',
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '2',
          ),
        ),
      ),
      'size' => 'large',
    ),
    31 => 
    array (
      'id' => '31',
      'type' => 'radio',
      'label' => 'Your marital status:',
      'required' => true,
      'choices' => 
      array (
        0 => 
        array (
          'value' => '1',
          'label' => 'Single',
        ),
        1 => 
        array (
          'value' => '2',
          'label' => 'Married',
        ),
      ),
      'css' => 'wpforms-one-fourth',
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '2',
          ),
        ),
      ),
      'input_columns' => 'inline',
    ),
    36 => 
    array (
      'id' => '36',
      'type' => 'number',
      'label' => 'Valid ID/Passport Number:',
      'required' => true,
      'placeholder' => 'Enter your national ID No.',
      'css' => 'wpforms-one-fourth wpforms-first',
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '2',
          ),
        ),
      ),
      'size' => 'large',
    ),
    35 => 
    array (
      'id' => '35',
      'type' => 'file-upload',
      'label' => 'Attach ID/Passport (Front & Back):',
      'required' => true,
      'max_file_number' => 2,
      'css' => 'wpforms-one-fourth',
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '2',
          ),
        ),
      ),
    ),
    34 => 
    array (
      'id' => '34',
      'type' => 'text',
      'label' => 'KRA PIN Number:',
      'required' => true,
      'limit_count' => 1,
      'limit_mode' => 'characters',
      'css' => 'wpforms-one-fourth',
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '2',
          ),
        ),
      ),
      'size' => 'large',
    ),
    39 => 
    array (
      'id' => '39',
      'type' => 'file-upload',
      'label' => 'Attach Your KRA PIN:',
      'required' => true,
      'max_file_number' => 1,
      'css' => 'wpforms-one-fourth',
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '2',
          ),
        ),
      ),
    ),
    79 => 
    array (
      'id' => '79',
      'type' => 'divider',
      'label' => 'Partner 2 Personal Details:',
      'required' => false,
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '2',
          ),
          1 => 
          array (
            'field' => '196',
            'operator' => '==',
            'value' => '1',
          ),
        ),
        1 => 
        array (
          0 => 
          array (
            'field' => '196',
            'operator' => '==',
            'value' => '2',
          ),
        ),
        2 => 
        array (
          0 => 
          array (
            'field' => '196',
            'operator' => '==',
            'value' => '3',
          ),
        ),
      ),
      'label_disable' => true,
    ),
    80 => 
    array (
      'id' => '80',
      'type' => 'name',
      'label' => 'Your name:',
      'required' => true,
      'format' => 'first-last',
      'css' => 'w wpforms-two-thirds wpforms-first',
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '2',
          ),
          1 => 
          array (
            'field' => '196',
            'operator' => '==',
            'value' => '1',
          ),
        ),
        1 => 
        array (
          0 => 
          array (
            'field' => '196',
            'operator' => '==',
            'value' => '2',
          ),
        ),
        2 => 
        array (
          0 => 
          array (
            'field' => '196',
            'operator' => '==',
            'value' => '3',
          ),
        ),
      ),
      'size' => 'large',
    ),
    81 => 
    array (
      'id' => '81',
      'type' => 'date-time',
      'label' => 'Date of birth:',
      'required' => true,
      'format' => 'date',
      'date_format' => 'd/m/Y',
      'css' => 'wpforms-one-third',
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '2',
          ),
          1 => 
          array (
            'field' => '196',
            'operator' => '==',
            'value' => '1',
          ),
        ),
        1 => 
        array (
          0 => 
          array (
            'field' => '196',
            'operator' => '==',
            'value' => '2',
          ),
        ),
        2 => 
        array (
          0 => 
          array (
            'field' => '196',
            'operator' => '==',
            'value' => '3',
          ),
        ),
      ),
      'size' => 'large',
    ),
    82 => 
    array (
      'id' => '82',
      'type' => 'select',
      'label' => 'Sex:',
      'required' => true,
      'placeholder' => '- Sex -',
      'choices' => 
      array (
        0 => 
        array (
          'value' => '1',
          'label' => 'Male',
        ),
        1 => 
        array (
          'value' => '2',
          'label' => 'Female',
        ),
        2 => 
        array (
          'value' => '3',
          'label' => 'Other',
        ),
      ),
      'css' => 'wpforms-one-fourth wpforms-first',
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '2',
          ),
          1 => 
          array (
            'field' => '196',
            'operator' => '==',
            'value' => '1',
          ),
        ),
        1 => 
        array (
          0 => 
          array (
            'field' => '196',
            'operator' => '==',
            'value' => '2',
          ),
        ),
        2 => 
        array (
          0 => 
          array (
            'field' => '196',
            'operator' => '==',
            'value' => '3',
          ),
        ),
      ),
      'size' => 'large',
    ),
    83 => 
    array (
      'id' => '83',
      'type' => 'phone',
      'label' => 'Mobile Number:',
      'required' => true,
      'format' => 'smart',
      'css' => 'wpforms-one-fourth',
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '2',
          ),
          1 => 
          array (
            'field' => '196',
            'operator' => '==',
            'value' => '1',
          ),
        ),
        1 => 
        array (
          0 => 
          array (
            'field' => '196',
            'operator' => '==',
            'value' => '2',
          ),
        ),
        2 => 
        array (
          0 => 
          array (
            'field' => '196',
            'operator' => '==',
            'value' => '3',
          ),
        ),
      ),
      'size' => 'large',
    ),
    84 => 
    array (
      'id' => '84',
      'type' => 'email',
      'label' => 'Email address:',
      'required' => true,
      'css' => 'wpforms-one-fourth',
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '2',
          ),
          1 => 
          array (
            'field' => '196',
            'operator' => '==',
            'value' => '1',
          ),
        ),
        1 => 
        array (
          0 => 
          array (
            'field' => '196',
            'operator' => '==',
            'value' => '2',
          ),
        ),
        2 => 
        array (
          0 => 
          array (
            'field' => '196',
            'operator' => '==',
            'value' => '3',
          ),
        ),
      ),
      'size' => 'large',
    ),
    85 => 
    array (
      'id' => '85',
      'type' => 'radio',
      'label' => 'Your marital status:',
      'required' => true,
      'choices' => 
      array (
        0 => 
        array (
          'value' => '1',
          'label' => 'Single',
        ),
        1 => 
        array (
          'value' => '2',
          'label' => 'Married',
        ),
      ),
      'css' => 'wpforms-one-fourth',
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '2',
          ),
          1 => 
          array (
            'field' => '196',
            'operator' => '==',
            'value' => '1',
          ),
        ),
        1 => 
        array (
          0 => 
          array (
            'field' => '196',
            'operator' => '==',
            'value' => '2',
          ),
        ),
        2 => 
        array (
          0 => 
          array (
            'field' => '196',
            'operator' => '==',
            'value' => '3',
          ),
        ),
      ),
      'input_columns' => 'inline',
    ),
    86 => 
    array (
      'id' => '86',
      'type' => 'number',
      'label' => 'Valid ID/Passport Number:',
      'required' => true,
      'placeholder' => 'Enter your national ID No.',
      'css' => 'wpforms-one-fourth wpforms-first',
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '2',
          ),
          1 => 
          array (
            'field' => '196',
            'operator' => '==',
            'value' => '1',
          ),
        ),
        1 => 
        array (
          0 => 
          array (
            'field' => '196',
            'operator' => '==',
            'value' => '2',
          ),
        ),
        2 => 
        array (
          0 => 
          array (
            'field' => '196',
            'operator' => '==',
            'value' => '3',
          ),
        ),
      ),
      'size' => 'large',
    ),
    87 => 
    array (
      'id' => '87',
      'type' => 'file-upload',
      'label' => 'Attach ID/Passport (Front & Back):',
      'required' => true,
      'max_file_number' => 2,
      'css' => 'wpforms-one-fourth',
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '2',
          ),
          1 => 
          array (
            'field' => '196',
            'operator' => '==',
            'value' => '1',
          ),
        ),
        1 => 
        array (
          0 => 
          array (
            'field' => '196',
            'operator' => '==',
            'value' => '2',
          ),
        ),
        2 => 
        array (
          0 => 
          array (
            'field' => '196',
            'operator' => '==',
            'value' => '3',
          ),
        ),
      ),
    ),
    88 => 
    array (
      'id' => '88',
      'type' => 'text',
      'label' => 'KRA PIN Number:',
      'required' => true,
      'limit_count' => 1,
      'limit_mode' => 'characters',
      'css' => 'wpforms-one-fourth',
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '2',
          ),
          1 => 
          array (
            'field' => '196',
            'operator' => '==',
            'value' => '1',
          ),
        ),
        1 => 
        array (
          0 => 
          array (
            'field' => '196',
            'operator' => '==',
            'value' => '2',
          ),
        ),
        2 => 
        array (
          0 => 
          array (
            'field' => '196',
            'operator' => '==',
            'value' => '3',
          ),
        ),
      ),
      'size' => 'large',
    ),
    89 => 
    array (
      'id' => '89',
      'type' => 'file-upload',
      'label' => 'Attach Your KRA PIN:',
      'required' => true,
      'max_file_number' => 1,
      'css' => 'wpforms-one-fourth',
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '2',
          ),
          1 => 
          array (
            'field' => '196',
            'operator' => '==',
            'value' => '1',
          ),
        ),
        1 => 
        array (
          0 => 
          array (
            'field' => '196',
            'operator' => '==',
            'value' => '2',
          ),
        ),
        2 => 
        array (
          0 => 
          array (
            'field' => '196',
            'operator' => '==',
            'value' => '3',
          ),
        ),
      ),
    ),
    90 => 
    array (
      'id' => '90',
      'type' => 'divider',
      'label' => 'Partner 3 Personal Details:',
      'required' => false,
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '2',
          ),
          1 => 
          array (
            'field' => '196',
            'operator' => '==',
            'value' => '2',
          ),
        ),
        1 => 
        array (
          0 => 
          array (
            'field' => '196',
            'operator' => '==',
            'value' => '3',
          ),
        ),
      ),
      'label_disable' => true,
    ),
    91 => 
    array (
      'id' => '91',
      'type' => 'name',
      'label' => 'Your name:',
      'required' => true,
      'format' => 'first-last',
      'css' => 'w wpforms-two-thirds wpforms-first',
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '2',
          ),
          1 => 
          array (
            'field' => '196',
            'operator' => '==',
            'value' => '2',
          ),
        ),
        1 => 
        array (
          0 => 
          array (
            'field' => '196',
            'operator' => '==',
            'value' => '3',
          ),
        ),
      ),
      'size' => 'large',
    ),
    92 => 
    array (
      'id' => '92',
      'type' => 'date-time',
      'label' => 'Date of birth:',
      'required' => true,
      'format' => 'date',
      'date_format' => 'd/m/Y',
      'css' => 'wpforms-one-third',
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '2',
          ),
          1 => 
          array (
            'field' => '196',
            'operator' => '==',
            'value' => '2',
          ),
        ),
        1 => 
        array (
          0 => 
          array (
            'field' => '196',
            'operator' => '==',
            'value' => '3',
          ),
        ),
      ),
      'size' => 'large',
    ),
    93 => 
    array (
      'id' => '93',
      'type' => 'select',
      'label' => 'Sex:',
      'required' => true,
      'placeholder' => '- Sex -',
      'choices' => 
      array (
        0 => 
        array (
          'value' => '1',
          'label' => 'Male',
        ),
        1 => 
        array (
          'value' => '2',
          'label' => 'Female',
        ),
        2 => 
        array (
          'value' => '3',
          'label' => 'Other',
        ),
      ),
      'css' => 'wpforms-one-fourth wpforms-first',
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '2',
          ),
          1 => 
          array (
            'field' => '196',
            'operator' => '==',
            'value' => '2',
          ),
        ),
        1 => 
        array (
          0 => 
          array (
            'field' => '196',
            'operator' => '==',
            'value' => '3',
          ),
        ),
      ),
      'size' => 'large',
    ),
    94 => 
    array (
      'id' => '94',
      'type' => 'phone',
      'label' => 'Mobile Number:',
      'required' => true,
      'format' => 'smart',
      'css' => 'wpforms-one-fourth',
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '2',
          ),
          1 => 
          array (
            'field' => '196',
            'operator' => '==',
            'value' => '2',
          ),
        ),
        1 => 
        array (
          0 => 
          array (
            'field' => '196',
            'operator' => '==',
            'value' => '3',
          ),
        ),
      ),
      'size' => 'large',
    ),
    95 => 
    array (
      'id' => '95',
      'type' => 'email',
      'label' => 'Email address:',
      'required' => true,
      'css' => 'wpforms-one-fourth',
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '2',
          ),
          1 => 
          array (
            'field' => '196',
            'operator' => '==',
            'value' => '2',
          ),
        ),
        1 => 
        array (
          0 => 
          array (
            'field' => '196',
            'operator' => '==',
            'value' => '3',
          ),
        ),
      ),
      'size' => 'large',
    ),
    96 => 
    array (
      'id' => '96',
      'type' => 'radio',
      'label' => 'Your marital status:',
      'required' => true,
      'choices' => 
      array (
        0 => 
        array (
          'value' => '1',
          'label' => 'Single',
        ),
        1 => 
        array (
          'value' => '2',
          'label' => 'Married',
        ),
      ),
      'css' => 'wpforms-one-fourth',
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '2',
          ),
          1 => 
          array (
            'field' => '196',
            'operator' => '==',
            'value' => '2',
          ),
        ),
        1 => 
        array (
          0 => 
          array (
            'field' => '196',
            'operator' => '==',
            'value' => '3',
          ),
        ),
      ),
      'input_columns' => 'inline',
    ),
    97 => 
    array (
      'id' => '97',
      'type' => 'number',
      'label' => 'Valid ID/Passport Number:',
      'required' => true,
      'placeholder' => 'Enter your national ID No.',
      'css' => 'wpforms-one-fourth wpforms-first',
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '2',
          ),
          1 => 
          array (
            'field' => '196',
            'operator' => '==',
            'value' => '2',
          ),
        ),
        1 => 
        array (
          0 => 
          array (
            'field' => '196',
            'operator' => '==',
            'value' => '3',
          ),
        ),
      ),
      'size' => 'large',
    ),
    98 => 
    array (
      'id' => '98',
      'type' => 'file-upload',
      'label' => 'Attach ID/Passport (Front & Back):',
      'required' => true,
      'max_file_number' => 2,
      'css' => 'wpforms-one-fourth',
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '2',
          ),
          1 => 
          array (
            'field' => '196',
            'operator' => '==',
            'value' => '2',
          ),
        ),
        1 => 
        array (
          0 => 
          array (
            'field' => '196',
            'operator' => '==',
            'value' => '3',
          ),
        ),
      ),
    ),
    99 => 
    array (
      'id' => '99',
      'type' => 'text',
      'label' => 'KRA PIN Number:',
      'required' => true,
      'limit_count' => 1,
      'limit_mode' => 'characters',
      'css' => 'wpforms-one-fourth',
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '2',
          ),
          1 => 
          array (
            'field' => '196',
            'operator' => '==',
            'value' => '2',
          ),
        ),
        1 => 
        array (
          0 => 
          array (
            'field' => '196',
            'operator' => '==',
            'value' => '3',
          ),
        ),
      ),
      'size' => 'large',
    ),
    100 => 
    array (
      'id' => '100',
      'type' => 'file-upload',
      'label' => 'Attach Your KRA PIN:',
      'required' => true,
      'max_file_number' => 1,
      'css' => 'wpforms-one-fourth',
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '2',
          ),
          1 => 
          array (
            'field' => '196',
            'operator' => '==',
            'value' => '2',
          ),
        ),
        1 => 
        array (
          0 => 
          array (
            'field' => '196',
            'operator' => '==',
            'value' => '3',
          ),
        ),
      ),
    ),
    101 => 
    array (
      'id' => '101',
      'type' => 'divider',
      'label' => 'Partner 4 Personal Details:',
      'required' => false,
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '2',
          ),
          1 => 
          array (
            'field' => '196',
            'operator' => '==',
            'value' => '3',
          ),
        ),
      ),
      'label_disable' => true,
    ),
    114 => 
    array (
      'id' => '114',
      'type' => 'name',
      'label' => 'Your name:',
      'required' => true,
      'format' => 'first-last',
      'css' => 'w wpforms-two-thirds wpforms-first',
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '2',
          ),
          1 => 
          array (
            'field' => '196',
            'operator' => '==',
            'value' => '3',
          ),
        ),
      ),
      'size' => 'large',
    ),
    113 => 
    array (
      'id' => '113',
      'type' => 'date-time',
      'label' => 'Date of birth:',
      'required' => true,
      'format' => 'date',
      'date_format' => 'd/m/Y',
      'css' => 'wpforms-one-third',
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '2',
          ),
          1 => 
          array (
            'field' => '196',
            'operator' => '==',
            'value' => '3',
          ),
        ),
      ),
      'size' => 'large',
    ),
    112 => 
    array (
      'id' => '112',
      'type' => 'select',
      'label' => 'Sex:',
      'required' => true,
      'placeholder' => '- Sex -',
      'choices' => 
      array (
        0 => 
        array (
          'value' => '1',
          'label' => 'Male',
        ),
        1 => 
        array (
          'value' => '2',
          'label' => 'Female',
        ),
        2 => 
        array (
          'value' => '3',
          'label' => 'Other',
        ),
      ),
      'css' => 'wpforms-one-fourth wpforms-first',
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '2',
          ),
          1 => 
          array (
            'field' => '196',
            'operator' => '==',
            'value' => '3',
          ),
        ),
      ),
      'size' => 'large',
    ),
    110 => 
    array (
      'id' => '110',
      'type' => 'phone',
      'label' => 'Mobile Number:',
      'required' => true,
      'format' => 'smart',
      'css' => 'wpforms-one-fourth',
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '2',
          ),
          1 => 
          array (
            'field' => '196',
            'operator' => '==',
            'value' => '3',
          ),
        ),
      ),
      'size' => 'large',
    ),
    109 => 
    array (
      'id' => '109',
      'type' => 'email',
      'label' => 'Email address:',
      'required' => true,
      'css' => 'wpforms-one-fourth',
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '2',
          ),
          1 => 
          array (
            'field' => '196',
            'operator' => '==',
            'value' => '3',
          ),
        ),
      ),
      'size' => 'large',
    ),
    108 => 
    array (
      'id' => '108',
      'type' => 'radio',
      'label' => 'Your marital status:',
      'required' => true,
      'choices' => 
      array (
        0 => 
        array (
          'value' => '1',
          'label' => 'Single',
        ),
        1 => 
        array (
          'value' => '2',
          'label' => 'Married',
        ),
      ),
      'css' => 'wpforms-one-fourth',
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '2',
          ),
          1 => 
          array (
            'field' => '196',
            'operator' => '==',
            'value' => '3',
          ),
        ),
      ),
      'input_columns' => 'inline',
    ),
    107 => 
    array (
      'id' => '107',
      'type' => 'number',
      'label' => 'Valid ID/Passport Number:',
      'required' => true,
      'placeholder' => 'Enter your national ID No.',
      'css' => 'wpforms-one-fourth wpforms-first',
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '2',
          ),
          1 => 
          array (
            'field' => '196',
            'operator' => '==',
            'value' => '3',
          ),
        ),
      ),
      'size' => 'large',
    ),
    105 => 
    array (
      'id' => '105',
      'type' => 'file-upload',
      'label' => 'Attach ID/Passport (Front & Back):',
      'required' => true,
      'max_file_number' => 2,
      'css' => 'wpforms-one-fourth',
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '2',
          ),
          1 => 
          array (
            'field' => '196',
            'operator' => '==',
            'value' => '3',
          ),
        ),
      ),
    ),
    104 => 
    array (
      'id' => '104',
      'type' => 'text',
      'label' => 'KRA PIN Number:',
      'required' => true,
      'limit_count' => 1,
      'limit_mode' => 'characters',
      'css' => 'wpforms-one-fourth',
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '2',
          ),
          1 => 
          array (
            'field' => '196',
            'operator' => '==',
            'value' => '3',
          ),
        ),
      ),
      'size' => 'large',
    ),
    103 => 
    array (
      'id' => '103',
      'type' => 'file-upload',
      'label' => 'Attach Your KRA PIN:',
      'required' => true,
      'max_file_number' => 1,
      'css' => 'wpforms-one-fourth',
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '2',
          ),
          1 => 
          array (
            'field' => '196',
            'operator' => '==',
            'value' => '3',
          ),
        ),
      ),
    ),
    115 => 
    array (
      'id' => '115',
      'type' => 'divider',
      'label' => 'Monthly Contributions:',
      'required' => false,
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '2',
          ),
        ),
      ),
      'label_disable' => true,
    ),
    116 => 
    array (
      'id' => '116',
      'type' => 'number',
      'label' => 'Propose monthly contributions (KSH):',
      'required' => true,
      'css' => 'wpforms-one-third wpforms-first',
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '2',
          ),
        ),
      ),
      'size' => 'large',
    ),
    117 => 
    array (
      'id' => '117',
      'type' => 'text',
      'label' => 'Amount in words:',
      'required' => true,
      'limit_count' => 1,
      'limit_mode' => 'characters',
      'css' => 'wpforms-two-thirds',
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '2',
          ),
        ),
      ),
      'size' => 'large',
    ),
    118 => 
    array (
      'id' => '118',
      'type' => 'checkbox',
      'label' => 'Proposed mode of remittance:',
      'required' => true,
      'choices' => 
      array (
        0 => 
        array (
          'value' => '1',
          'label' => 'Check Off',
        ),
        1 => 
        array (
          'value' => '2',
          'label' => 'Standing Order',
        ),
        2 => 
        array (
          'value' => '3',
          'label' => 'Direct Debit',
        ),
        3 => 
        array (
          'value' => '4',
          'label' => 'Other',
        ),
      ),
      'css' => 'wpforms-one-third wpforms-first',
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '2',
          ),
        ),
      ),
      'input_columns' => 'inline',
    ),
    119 => 
    array (
      'id' => '119',
      'type' => 'text',
      'label' => 'If other, specify:',
      'required' => true,
      'limit_count' => 1,
      'limit_mode' => 'characters',
      'css' => 'wpforms-one-third',
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '2',
          ),
          1 => 
          array (
            'field' => '118',
            'operator' => '==',
            'value' => '4',
          ),
        ),
      ),
      'size' => 'large',
    ),
    120 => 
    array (
      'id' => '120',
      'type' => 'date-time',
      'label' => 'Effective date:',
      'required' => true,
      'format' => 'date',
      'date_format' => 'd/m/Y',
      'css' => 'wpforms-one-third',
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '2',
          ),
        ),
      ),
      'size' => 'large',
    ),
    121 => 
    array (
      'id' => '121',
      'type' => 'name',
      'label' => '1st signatory name:',
      'required' => true,
      'format' => 'simple',
      'css' => 'wpforms-one-fourth wpforms-first',
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '2',
          ),
        ),
      ),
      'size' => 'large',
    ),
    122 => 
    array (
      'id' => '122',
      'type' => 'number',
      'label' => 'ID number:',
      'required' => true,
      'css' => 'wpforms-one-fourth',
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '2',
          ),
        ),
      ),
      'size' => 'large',
    ),
    123 => 
    array (
      'id' => '123',
      'type' => 'date-time',
      'label' => 'Date:',
      'required' => true,
      'format' => 'date',
      'date_format' => 'd/m/Y',
      'css' => 'wpforms-one-fourth',
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '2',
          ),
        ),
      ),
      'size' => 'large',
    ),
    124 => 
    array (
      'id' => '124',
      'type' => 'file-upload',
      'label' => 'Signature:',
      'required' => true,
      'max_file_number' => 1,
      'css' => 'wpforms-one-fourth',
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '2',
          ),
        ),
      ),
    ),
    125 => 
    array (
      'id' => '125',
      'type' => 'name',
      'label' => '2nd signatory name:',
      'required' => true,
      'format' => 'simple',
      'css' => 'wpforms-one-fourth wpforms-first',
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '2',
          ),
          1 => 
          array (
            'field' => '196',
            'operator' => '==',
            'value' => '1',
          ),
        ),
        1 => 
        array (
          0 => 
          array (
            'field' => '196',
            'operator' => '==',
            'value' => '2',
          ),
        ),
        2 => 
        array (
          0 => 
          array (
            'field' => '196',
            'operator' => '==',
            'value' => '3',
          ),
        ),
      ),
      'size' => 'large',
    ),
    126 => 
    array (
      'id' => '126',
      'type' => 'number',
      'label' => 'ID number:',
      'required' => true,
      'css' => 'wpforms-one-fourth',
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '2',
          ),
          1 => 
          array (
            'field' => '196',
            'operator' => '==',
            'value' => '1',
          ),
        ),
        1 => 
        array (
          0 => 
          array (
            'field' => '196',
            'operator' => '==',
            'value' => '2',
          ),
        ),
        2 => 
        array (
          0 => 
          array (
            'field' => '196',
            'operator' => '==',
            'value' => '3',
          ),
        ),
      ),
      'size' => 'large',
    ),
    127 => 
    array (
      'id' => '127',
      'type' => 'date-time',
      'label' => 'Date:',
      'required' => true,
      'format' => 'date',
      'date_format' => 'd/m/Y',
      'css' => 'wpforms-one-fourth',
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '2',
          ),
          1 => 
          array (
            'field' => '196',
            'operator' => '==',
            'value' => '1',
          ),
        ),
        1 => 
        array (
          0 => 
          array (
            'field' => '196',
            'operator' => '==',
            'value' => '2',
          ),
        ),
        2 => 
        array (
          0 => 
          array (
            'field' => '196',
            'operator' => '==',
            'value' => '3',
          ),
        ),
      ),
      'size' => 'large',
    ),
    128 => 
    array (
      'id' => '128',
      'type' => 'file-upload',
      'label' => 'Signature:',
      'required' => true,
      'max_file_number' => 1,
      'css' => 'wpforms-one-fourth',
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '2',
          ),
          1 => 
          array (
            'field' => '196',
            'operator' => '==',
            'value' => '1',
          ),
        ),
        1 => 
        array (
          0 => 
          array (
            'field' => '196',
            'operator' => '==',
            'value' => '2',
          ),
        ),
        2 => 
        array (
          0 => 
          array (
            'field' => '196',
            'operator' => '==',
            'value' => '3',
          ),
        ),
      ),
    ),
    129 => 
    array (
      'id' => '129',
      'type' => 'name',
      'label' => '3rd signatory name:',
      'required' => true,
      'format' => 'simple',
      'css' => 'wpforms-one-fourth wpforms-first',
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '2',
          ),
          1 => 
          array (
            'field' => '196',
            'operator' => '==',
            'value' => '2',
          ),
        ),
        1 => 
        array (
          0 => 
          array (
            'field' => '196',
            'operator' => '==',
            'value' => '3',
          ),
        ),
      ),
      'size' => 'large',
    ),
    130 => 
    array (
      'id' => '130',
      'type' => 'number',
      'label' => 'ID number:',
      'required' => true,
      'css' => 'wpforms-one-fourth',
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '2',
          ),
          1 => 
          array (
            'field' => '196',
            'operator' => '==',
            'value' => '2',
          ),
        ),
        1 => 
        array (
          0 => 
          array (
            'field' => '196',
            'operator' => '==',
            'value' => '3',
          ),
        ),
      ),
      'size' => 'large',
    ),
    131 => 
    array (
      'id' => '131',
      'type' => 'date-time',
      'label' => 'Date:',
      'required' => true,
      'format' => 'date',
      'date_format' => 'd/m/Y',
      'css' => 'wpforms-one-fourth',
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '2',
          ),
          1 => 
          array (
            'field' => '196',
            'operator' => '==',
            'value' => '2',
          ),
        ),
        1 => 
        array (
          0 => 
          array (
            'field' => '196',
            'operator' => '==',
            'value' => '3',
          ),
        ),
      ),
      'size' => 'large',
    ),
    132 => 
    array (
      'id' => '132',
      'type' => 'file-upload',
      'label' => 'Signature:',
      'required' => true,
      'max_file_number' => 1,
      'css' => 'wpforms-one-fourth',
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '2',
          ),
          1 => 
          array (
            'field' => '196',
            'operator' => '==',
            'value' => '2',
          ),
        ),
        1 => 
        array (
          0 => 
          array (
            'field' => '196',
            'operator' => '==',
            'value' => '3',
          ),
        ),
      ),
    ),
    133 => 
    array (
      'id' => '133',
      'type' => 'name',
      'label' => '4th signatory name:',
      'required' => true,
      'format' => 'simple',
      'css' => 'wpforms-one-fourth wpforms-first',
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '2',
          ),
          1 => 
          array (
            'field' => '196',
            'operator' => '==',
            'value' => '3',
          ),
        ),
      ),
      'size' => 'large',
    ),
    134 => 
    array (
      'id' => '134',
      'type' => 'number',
      'label' => 'ID number:',
      'required' => true,
      'css' => 'wpforms-one-fourth',
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '2',
          ),
          1 => 
          array (
            'field' => '196',
            'operator' => '==',
            'value' => '3',
          ),
        ),
      ),
      'size' => 'large',
    ),
    135 => 
    array (
      'id' => '135',
      'type' => 'date-time',
      'label' => 'Date:',
      'required' => true,
      'format' => 'date',
      'date_format' => 'd/m/Y',
      'css' => 'wpforms-one-fourth',
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '2',
          ),
          1 => 
          array (
            'field' => '196',
            'operator' => '==',
            'value' => '3',
          ),
        ),
      ),
      'size' => 'large',
    ),
    136 => 
    array (
      'id' => '136',
      'type' => 'file-upload',
      'label' => 'Signature:',
      'required' => true,
      'max_file_number' => 1,
      'css' => 'wpforms-one-fourth',
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '2',
          ),
          1 => 
          array (
            'field' => '196',
            'operator' => '==',
            'value' => '3',
          ),
        ),
      ),
    ),
    137 => 
    array (
      'id' => '137',
      'type' => 'name',
      'label' => 'Witnessed by (name):',
      'required' => true,
      'format' => 'simple',
      'css' => 'wpforms-one-fourth wpforms-first',
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '2',
          ),
        ),
      ),
      'size' => 'large',
    ),
    138 => 
    array (
      'id' => '138',
      'type' => 'number',
      'label' => 'ID number:',
      'required' => true,
      'css' => 'wpforms-one-fourth',
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '2',
          ),
        ),
      ),
      'size' => 'large',
    ),
    139 => 
    array (
      'id' => '139',
      'type' => 'date-time',
      'label' => 'Date:',
      'required' => true,
      'format' => 'date',
      'date_format' => 'd/m/Y',
      'css' => 'wpforms-one-fourth',
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '2',
          ),
        ),
      ),
      'size' => 'large',
    ),
    140 => 
    array (
      'id' => '140',
      'type' => 'file-upload',
      'label' => 'Signature:',
      'required' => true,
      'max_file_number' => 1,
      'css' => 'wpforms-one-fourth',
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '2',
          ),
        ),
      ),
    ),
    141 => 
    array (
      'id' => '141',
      'type' => 'divider',
      'label' => 'Corporate/Group Application:',
      'required' => false,
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '3',
          ),
        ),
      ),
      'label_disable' => true,
    ),
    142 => 
    array (
      'id' => '142',
      'type' => 'name',
      'label' => 'Name of group/institution:',
      'required' => true,
      'format' => 'simple',
      'css' => 'wpforms-two-fourths wpforms-first',
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '3',
          ),
        ),
      ),
      'size' => 'large',
    ),
    146 => 
    array (
      'id' => '146',
      'type' => 'select',
      'label' => 'Type of organization:',
      'required' => true,
      'placeholder' => '- Select Type -',
      'choices' => 
      array (
        0 => 
        array (
          'value' => '1',
          'label' => 'Group',
        ),
        1 => 
        array (
          'value' => '2',
          'label' => 'Association',
        ),
        2 => 
        array (
          'value' => '3',
          'label' => 'Partnership',
        ),
        3 => 
        array (
          'value' => '4',
          'label' => 'Company',
        ),
        4 => 
        array (
          'value' => '5',
          'label' => 'Other',
        ),
      ),
      'css' => 'wpforms-one-fourth',
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '3',
          ),
        ),
      ),
      'size' => 'large',
    ),
    144 => 
    array (
      'id' => '144',
      'type' => 'text',
      'label' => 'If other, specify:',
      'required' => true,
      'limit_count' => 1,
      'limit_mode' => 'characters',
      'css' => 'wpforms-one-fourth',
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '3',
          ),
          1 => 
          array (
            'field' => '146',
            'operator' => '==',
            'value' => '5',
          ),
        ),
      ),
      'size' => 'large',
    ),
    147 => 
    array (
      'id' => '147',
      'type' => 'text',
      'label' => 'Registration No:',
      'required' => true,
      'limit_count' => 1,
      'limit_mode' => 'characters',
      'css' => 'wpforms-one-third wpforms-first',
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '3',
          ),
        ),
      ),
      'size' => 'large',
    ),
    148 => 
    array (
      'id' => '148',
      'type' => 'date-time',
      'label' => 'Date of Registration/Incorporation:',
      'required' => true,
      'format' => 'date',
      'date_format' => 'd/m/Y',
      'css' => 'wpforms-one-third',
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '3',
          ),
        ),
      ),
      'size' => 'large',
    ),
    150 => 
    array (
      'id' => '150',
      'type' => 'divider',
      'label' => 'Registered Offices:',
      'required' => false,
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '3',
          ),
        ),
      ),
      'label_disable' => true,
    ),
    149 => 
    array (
      'id' => '149',
      'type' => 'text',
      'label' => 'Postal Address',
      'required' => true,
      'limit_count' => 1,
      'limit_mode' => 'characters',
      'css' => 'wpforms-one-third wpforms-first',
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '3',
          ),
        ),
      ),
      'size' => 'large',
    ),
    152 => 
    array (
      'id' => '152',
      'type' => 'number',
      'label' => 'Code',
      'required' => true,
      'css' => 'wpforms-one-third',
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '3',
          ),
        ),
      ),
      'size' => 'large',
    ),
    153 => 
    array (
      'id' => '153',
      'type' => 'text',
      'label' => 'Town',
      'required' => true,
      'limit_count' => 1,
      'limit_mode' => 'characters',
      'css' => 'wpforms-one-third',
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '3',
          ),
        ),
      ),
      'size' => 'large',
    ),
    154 => 
    array (
      'id' => '154',
      'type' => 'phone',
      'label' => 'Office Phone/Mobile Number:',
      'required' => true,
      'format' => 'smart',
      'css' => 'wpforms-one-half wpforms-first',
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '3',
          ),
        ),
      ),
      'size' => 'large',
    ),
    155 => 
    array (
      'id' => '155',
      'type' => 'email',
      'label' => 'Office Email:',
      'required' => true,
      'css' => 'wpforms-one-half',
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '3',
          ),
        ),
      ),
      'size' => 'large',
    ),
    156 => 
    array (
      'id' => '156',
      'type' => 'name',
      'label' => 'Contact Person:',
      'required' => true,
      'format' => 'simple',
      'css' => 'wpforms-one-half wpforms-first',
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '3',
          ),
        ),
      ),
      'size' => 'large',
    ),
    157 => 
    array (
      'id' => '157',
      'type' => 'phone',
      'label' => 'Mobile Number:',
      'required' => true,
      'format' => 'smart',
      'css' => 'wpforms-one-half',
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '3',
          ),
        ),
      ),
      'size' => 'large',
    ),
    158 => 
    array (
      'id' => '158',
      'type' => 'text',
      'label' => 'Physical Address(Building Name):',
      'required' => true,
      'limit_count' => 1,
      'limit_mode' => 'characters',
      'css' => 'wpforms-one-half wpforms-first',
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '3',
          ),
        ),
      ),
      'size' => 'large',
    ),
    159 => 
    array (
      'id' => '159',
      'type' => 'text',
      'label' => 'Street:',
      'required' => true,
      'limit_count' => 1,
      'limit_mode' => 'characters',
      'css' => 'wpforms-one-half',
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '3',
          ),
        ),
      ),
      'size' => 'large',
    ),
    160 => 
    array (
      'id' => '160',
      'type' => 'text',
      'label' => 'Nature of Business:',
      'required' => true,
      'limit_count' => 1,
      'limit_mode' => 'characters',
      'css' => 'wpforms-one-half wpforms-first',
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '3',
          ),
        ),
      ),
      'size' => 'large',
    ),
    161 => 
    array (
      'id' => '161',
      'type' => 'radio',
      'label' => 'Purpose of account opening:',
      'required' => true,
      'choices' => 
      array (
        0 => 
        array (
          'value' => '1',
          'label' => 'Investment',
        ),
        1 => 
        array (
          'value' => '2',
          'label' => 'Transaction',
        ),
        2 => 
        array (
          'value' => '3',
          'label' => 'Savings & Borrowing',
        ),
      ),
      'css' => 'wpforms-one-half',
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '3',
          ),
        ),
      ),
      'input_columns' => 'inline',
    ),
    162 => 
    array (
      'id' => '162',
      'type' => 'radio',
      'label' => 'Sources of funds to the account:',
      'required' => true,
      'choices' => 
      array (
        0 => 
        array (
          'value' => '1',
          'label' => 'Business Income',
        ),
        1 => 
        array (
          'value' => '2',
          'label' => 'Shareholder Contributions',
        ),
        2 => 
        array (
          'value' => '3',
          'label' => 'Borrowing',
        ),
        3 => 
        array (
          'value' => '4',
          'label' => 'Income Investments',
        ),
        4 => 
        array (
          'value' => '5',
          'label' => 'Others (Specify)',
        ),
      ),
      'css' => 'wpforms-one-half wpforms-first',
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '3',
          ),
        ),
      ),
      'input_columns' => 'inline',
    ),
    163 => 
    array (
      'id' => '163',
      'type' => 'text',
      'label' => 'Others (Specify):',
      'required' => true,
      'limit_count' => 1,
      'limit_mode' => 'characters',
      'css' => 'wpforms-one-half',
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '3',
          ),
          1 => 
          array (
            'field' => '162',
            'operator' => '==',
            'value' => '5',
          ),
        ),
      ),
      'size' => 'large',
    ),
    210 => 
    array (
      'id' => '210',
      'type' => 'file-upload',
      'label' => 'Attach Group/Company Registration Certificate:',
      'required' => true,
      'max_file_number' => 1,
      'css' => 'wpforms-one-third wpforms-first',
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '3',
          ),
        ),
      ),
    ),
    178 => 
    array (
      'id' => '178',
      'type' => 'divider',
      'label' => 'Names of Directors/Officials:',
      'required' => false,
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '3',
          ),
        ),
      ),
      'label_disable' => true,
    ),
    197 => 
    array (
      'id' => '197',
      'type' => 'select',
      'label' => 'How many directors/officials does the company/group have?',
      'required' => true,
      'placeholder' => '- Select No. -',
      'choices' => 
      array (
        0 => 
        array (
          'value' => '1',
          'label' => '2',
        ),
        1 => 
        array (
          'value' => '2',
          'label' => '3',
        ),
        2 => 
        array (
          'value' => '3',
          'label' => '4',
        ),
      ),
      'css' => 'wpforms-one-third wpforms-first',
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '3',
          ),
        ),
      ),
      'size' => 'large',
    ),
    174 => 
    array (
      'id' => '174',
      'type' => 'name',
      'label' => '1st director/official name:',
      'required' => true,
      'format' => 'simple',
      'css' => 'wpforms-one-third wpforms-first',
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '3',
          ),
        ),
      ),
      'size' => 'large',
    ),
    175 => 
    array (
      'id' => '175',
      'type' => 'number',
      'label' => 'ID number:',
      'required' => true,
      'css' => 'wpforms-one-third',
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '3',
          ),
        ),
      ),
      'size' => 'large',
    ),
    184 => 
    array (
      'id' => '184',
      'type' => 'text',
      'label' => 'Post held:',
      'required' => true,
      'limit_count' => 1,
      'limit_mode' => 'characters',
      'css' => 'wpforms-one-third',
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '3',
          ),
        ),
      ),
      'size' => 'large',
    ),
    179 => 
    array (
      'id' => '179',
      'type' => 'name',
      'label' => '2nd director/official name:',
      'required' => true,
      'format' => 'simple',
      'css' => 'wpforms-one-third wpforms-first',
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '3',
          ),
          1 => 
          array (
            'field' => '197',
            'operator' => '==',
            'value' => '1',
          ),
        ),
        1 => 
        array (
          0 => 
          array (
            'field' => '197',
            'operator' => '==',
            'value' => '2',
          ),
        ),
        2 => 
        array (
          0 => 
          array (
            'field' => '197',
            'operator' => '==',
            'value' => '3',
          ),
        ),
      ),
      'size' => 'large',
    ),
    185 => 
    array (
      'id' => '185',
      'type' => 'number',
      'label' => 'ID number:',
      'required' => true,
      'css' => 'wpforms-one-third',
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '3',
          ),
          1 => 
          array (
            'field' => '197',
            'operator' => '==',
            'value' => '1',
          ),
        ),
        1 => 
        array (
          0 => 
          array (
            'field' => '197',
            'operator' => '==',
            'value' => '2',
          ),
        ),
        2 => 
        array (
          0 => 
          array (
            'field' => '197',
            'operator' => '==',
            'value' => '3',
          ),
        ),
      ),
      'size' => 'large',
    ),
    186 => 
    array (
      'id' => '186',
      'type' => 'text',
      'label' => 'Post held:',
      'required' => true,
      'limit_count' => 1,
      'limit_mode' => 'characters',
      'css' => 'wpforms-one-third',
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '3',
          ),
          1 => 
          array (
            'field' => '197',
            'operator' => '==',
            'value' => '1',
          ),
        ),
        1 => 
        array (
          0 => 
          array (
            'field' => '197',
            'operator' => '==',
            'value' => '2',
          ),
        ),
        2 => 
        array (
          0 => 
          array (
            'field' => '197',
            'operator' => '==',
            'value' => '3',
          ),
        ),
      ),
      'size' => 'large',
    ),
    198 => 
    array (
      'id' => '198',
      'type' => 'name',
      'label' => '3rd director/official name:',
      'required' => true,
      'format' => 'simple',
      'css' => 'wpforms-one-third wpforms-first',
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '3',
          ),
          1 => 
          array (
            'field' => '197',
            'operator' => '==',
            'value' => '2',
          ),
        ),
        1 => 
        array (
          0 => 
          array (
            'field' => '197',
            'operator' => '==',
            'value' => '3',
          ),
        ),
      ),
      'size' => 'large',
    ),
    199 => 
    array (
      'id' => '199',
      'type' => 'number',
      'label' => 'ID number:',
      'required' => true,
      'css' => 'wpforms-one-third',
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '3',
          ),
          1 => 
          array (
            'field' => '197',
            'operator' => '==',
            'value' => '2',
          ),
        ),
        1 => 
        array (
          0 => 
          array (
            'field' => '197',
            'operator' => '==',
            'value' => '3',
          ),
        ),
      ),
      'size' => 'large',
    ),
    200 => 
    array (
      'id' => '200',
      'type' => 'text',
      'label' => 'Post held:',
      'required' => true,
      'limit_count' => 1,
      'limit_mode' => 'characters',
      'css' => 'wpforms-one-third',
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '3',
          ),
          1 => 
          array (
            'field' => '197',
            'operator' => '==',
            'value' => '2',
          ),
        ),
        1 => 
        array (
          0 => 
          array (
            'field' => '197',
            'operator' => '==',
            'value' => '3',
          ),
        ),
      ),
      'size' => 'large',
    ),
    201 => 
    array (
      'id' => '201',
      'type' => 'name',
      'label' => '4th director/official name:',
      'required' => true,
      'format' => 'simple',
      'css' => 'wpforms-one-third wpforms-first',
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '3',
          ),
          1 => 
          array (
            'field' => '197',
            'operator' => '==',
            'value' => '3',
          ),
        ),
      ),
      'size' => 'large',
    ),
    202 => 
    array (
      'id' => '202',
      'type' => 'number',
      'label' => 'ID number:',
      'required' => true,
      'css' => 'wpforms-one-third',
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '3',
          ),
          1 => 
          array (
            'field' => '197',
            'operator' => '==',
            'value' => '3',
          ),
        ),
      ),
      'size' => 'large',
    ),
    203 => 
    array (
      'id' => '203',
      'type' => 'text',
      'label' => 'Post held:',
      'required' => true,
      'limit_count' => 1,
      'limit_mode' => 'characters',
      'css' => 'wpforms-one-third',
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '3',
          ),
          1 => 
          array (
            'field' => '197',
            'operator' => '==',
            'value' => '3',
          ),
        ),
      ),
      'size' => 'large',
    ),
    180 => 
    array (
      'id' => '180',
      'type' => 'divider',
      'label' => 'Signatories:',
      'required' => false,
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '3',
          ),
        ),
      ),
      'label_disable' => true,
    ),
    181 => 
    array (
      'id' => '181',
      'type' => 'name',
      'label' => '1st signatory name:',
      'required' => true,
      'format' => 'simple',
      'css' => 'wpforms-one-fourth wpforms-first',
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '3',
          ),
        ),
      ),
      'size' => 'large',
    ),
    182 => 
    array (
      'id' => '182',
      'type' => 'number',
      'label' => 'ID number:',
      'required' => true,
      'css' => 'wpforms-one-fourth',
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '3',
          ),
        ),
      ),
      'size' => 'large',
    ),
    176 => 
    array (
      'id' => '176',
      'type' => 'date-time',
      'label' => 'Date:',
      'required' => true,
      'format' => 'date',
      'date_format' => 'd/m/Y',
      'css' => 'wpforms-one-fourth',
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '3',
          ),
        ),
      ),
      'size' => 'large',
    ),
    183 => 
    array (
      'id' => '183',
      'type' => 'file-upload',
      'label' => 'Signature:',
      'required' => true,
      'max_file_number' => 1,
      'css' => 'wpforms-one-fourth',
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '3',
          ),
        ),
      ),
    ),
    187 => 
    array (
      'id' => '187',
      'type' => 'name',
      'label' => '2nd signatory name:',
      'required' => true,
      'format' => 'simple',
      'css' => 'wpforms-one-fourth wpforms-first',
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '3',
          ),
          1 => 
          array (
            'field' => '197',
            'operator' => '==',
            'value' => '1',
          ),
        ),
        1 => 
        array (
          0 => 
          array (
            'field' => '197',
            'operator' => '==',
            'value' => '2',
          ),
        ),
        2 => 
        array (
          0 => 
          array (
            'field' => '197',
            'operator' => '==',
            'value' => '3',
          ),
        ),
      ),
      'size' => 'large',
    ),
    188 => 
    array (
      'id' => '188',
      'type' => 'number',
      'label' => 'ID number:',
      'required' => true,
      'css' => 'wpforms-one-fourth',
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '3',
          ),
          1 => 
          array (
            'field' => '197',
            'operator' => '==',
            'value' => '1',
          ),
        ),
        1 => 
        array (
          0 => 
          array (
            'field' => '197',
            'operator' => '==',
            'value' => '2',
          ),
        ),
        2 => 
        array (
          0 => 
          array (
            'field' => '197',
            'operator' => '==',
            'value' => '3',
          ),
        ),
      ),
      'size' => 'large',
    ),
    189 => 
    array (
      'id' => '189',
      'type' => 'date-time',
      'label' => 'Date:',
      'required' => true,
      'format' => 'date',
      'date_format' => 'd/m/Y',
      'css' => 'wpforms-one-fourth',
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '3',
          ),
          1 => 
          array (
            'field' => '197',
            'operator' => '==',
            'value' => '1',
          ),
        ),
        1 => 
        array (
          0 => 
          array (
            'field' => '197',
            'operator' => '==',
            'value' => '2',
          ),
        ),
        2 => 
        array (
          0 => 
          array (
            'field' => '197',
            'operator' => '==',
            'value' => '3',
          ),
        ),
      ),
      'size' => 'large',
    ),
    190 => 
    array (
      'id' => '190',
      'type' => 'file-upload',
      'label' => 'Signature:',
      'required' => true,
      'max_file_number' => 1,
      'css' => 'wpforms-one-fourth',
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '3',
          ),
          1 => 
          array (
            'field' => '197',
            'operator' => '==',
            'value' => '1',
          ),
        ),
        1 => 
        array (
          0 => 
          array (
            'field' => '197',
            'operator' => '==',
            'value' => '2',
          ),
        ),
        2 => 
        array (
          0 => 
          array (
            'field' => '197',
            'operator' => '==',
            'value' => '3',
          ),
        ),
      ),
    ),
    191 => 
    array (
      'id' => '191',
      'type' => 'name',
      'label' => '3rd signatory name:',
      'required' => true,
      'format' => 'simple',
      'css' => 'wpforms-one-fourth wpforms-first',
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '3',
          ),
          1 => 
          array (
            'field' => '197',
            'operator' => '==',
            'value' => '2',
          ),
        ),
        1 => 
        array (
          0 => 
          array (
            'field' => '197',
            'operator' => '==',
            'value' => '3',
          ),
        ),
      ),
      'size' => 'large',
    ),
    192 => 
    array (
      'id' => '192',
      'type' => 'number',
      'label' => 'ID number:',
      'required' => true,
      'css' => 'wpforms-one-fourth',
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '3',
          ),
          1 => 
          array (
            'field' => '197',
            'operator' => '==',
            'value' => '2',
          ),
        ),
        1 => 
        array (
          0 => 
          array (
            'field' => '197',
            'operator' => '==',
            'value' => '3',
          ),
        ),
      ),
      'size' => 'large',
    ),
    193 => 
    array (
      'id' => '193',
      'type' => 'date-time',
      'label' => 'Date:',
      'required' => true,
      'format' => 'date',
      'date_format' => 'd/m/Y',
      'css' => 'wpforms-one-fourth',
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '3',
          ),
          1 => 
          array (
            'field' => '197',
            'operator' => '==',
            'value' => '2',
          ),
        ),
        1 => 
        array (
          0 => 
          array (
            'field' => '197',
            'operator' => '==',
            'value' => '3',
          ),
        ),
      ),
      'size' => 'large',
    ),
    194 => 
    array (
      'id' => '194',
      'type' => 'file-upload',
      'label' => 'Signature:',
      'required' => true,
      'max_file_number' => 1,
      'css' => 'wpforms-one-fourth',
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '3',
          ),
          1 => 
          array (
            'field' => '197',
            'operator' => '==',
            'value' => '2',
          ),
        ),
        1 => 
        array (
          0 => 
          array (
            'field' => '197',
            'operator' => '==',
            'value' => '3',
          ),
        ),
      ),
    ),
    204 => 
    array (
      'id' => '204',
      'type' => 'name',
      'label' => '4th signatory name:',
      'required' => true,
      'format' => 'simple',
      'css' => 'wpforms-one-fourth wpforms-first',
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '3',
          ),
          1 => 
          array (
            'field' => '197',
            'operator' => '==',
            'value' => '3',
          ),
        ),
      ),
      'size' => 'large',
    ),
    205 => 
    array (
      'id' => '205',
      'type' => 'number',
      'label' => 'ID number:',
      'required' => true,
      'css' => 'wpforms-one-fourth',
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '3',
          ),
          1 => 
          array (
            'field' => '197',
            'operator' => '==',
            'value' => '3',
          ),
        ),
      ),
      'size' => 'large',
    ),
    206 => 
    array (
      'id' => '206',
      'type' => 'date-time',
      'label' => 'Date:',
      'required' => true,
      'format' => 'date',
      'date_format' => 'd/m/Y',
      'css' => 'wpforms-one-fourth',
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '3',
          ),
          1 => 
          array (
            'field' => '197',
            'operator' => '==',
            'value' => '3',
          ),
        ),
      ),
      'size' => 'large',
    ),
    207 => 
    array (
      'id' => '207',
      'type' => 'file-upload',
      'label' => 'Signature:',
      'required' => true,
      'max_file_number' => 1,
      'css' => 'wpforms-one-fourth',
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '3',
          ),
          1 => 
          array (
            'field' => '197',
            'operator' => '==',
            'value' => '3',
          ),
        ),
      ),
    ),
    214 => 
    array (
      'id' => '214',
      'type' => 'divider',
      'label' => 'Reference Code (Registration Fee Payment):',
      'required' => false,
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '1',
          ),
        ),
        1 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '2',
          ),
        ),
        2 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '3',
          ),
        ),
      ),
      'label_disable' => true,
    ),
    215 => 
    array (
      'id' => '215',
      'type' => 'text',
      'label' => 'M-PESA Transaction Code:',
      'required' => true,
      'placeholder' => 'eg. QK72G6UMYO',
      'limit_count' => 10,
      'limit_mode' => 'characters',
      'limit_enabled' => true,
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '1',
          ),
        ),
        1 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '2',
          ),
        ),
        2 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '3',
          ),
        ),
      ),
      'size' => 'medium',
    ),
    211 => 
    array (
      'id' => '211',
      'type' => 'divider',
      'label' => 'Recruited by (Optional):',
      'required' => false,
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '1',
          ),
        ),
        1 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '2',
          ),
        ),
        2 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '3',
          ),
        ),
      ),
      'label_disable' => true,
    ),
    212 => 
    array (
      'id' => '212',
      'type' => 'name',
      'label' => 'Full Name:',
      'required' => false,
      'format' => 'simple',
      'css' => 'wpforms-one-half wpforms-first',
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '1',
          ),
        ),
        1 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '2',
          ),
        ),
        2 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '3',
          ),
        ),
      ),
      'size' => 'large',
    ),
    213 => 
    array (
      'id' => '213',
      'type' => 'name',
      'label' => 'Company Code',
      'required' => false,
      'format' => 'simple',
      'css' => 'wpforms-one-third wpforms-last',
      'conditional_logic' => true,
      'conditional_type' => 'show',
      'conditionals' => 
      array (
        0 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '1',
          ),
        ),
        1 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '2',
          ),
        ),
        2 => 
        array (
          0 => 
          array (
            'field' => '28',
            'operator' => '==',
            'value' => '3',
          ),
        ),
      ),
      'size' => 'small',
    ),
  ),
  'settings' => 
  array (
    'form_title' => 'Onboarding Form',
    'submit_text' => 'Submit Details',
    'submit_text_processing' => 'Sending...',
    'form_slug' => 'onboarding_form',
    'confirmation' => 
    array (
      'message' => 'Thank you for submitting your details! We are processing your member application and will be in touch with you shortly.',
      'message_html' => '<p>Thank you for submitting your details! We are processing your member application and will be in touch with you shortly.</p>',
    ),
    'notifications' => 
    array (
      1 => 
      array (
        'email' => 'onboard.msaportsacco@gmail.com',
        'subject' => 'New Entry: Membership Onboarding Form',
        'sender_name' => 'Ports Sacco Website',
        'sender_address' => 'wordpress@portsacco.co.ke',
        'replyto' => '{field_id="2"} {field_id="32"} {field_id="84"} {field_id="95"} {field_id="109"} {field_id="109"} {field_id="109"}',
        'message' => '{all_fields}',
      ),
      2 => 
      array (
        'email' => '{field_id="2"} {field_id="32"} {field_id="84"} {field_id="95"} {field_id="109"}',
        'subject' => 'Member Registration',
        'sender_name' => 'Ports Sacco',
        'sender_address' => 'wordpress@portsacco.co.ke',
        'replyto' => 'onboard.msaportsacco@gmail.com',
        'message' => 'Hello {field_id="1"}, 
Thank you for submitting your details.
We have received your details and we are processing your membership application. 
We will be in touch soon.

--
This automated email has been sent by the membership form on the Ports Sacco website because your email was submitted in the application. If that was not done by you then please ignore this email.',
      ),
    ),
    'submitter_email_field_ids' => 
    array (
      0 => '2',
      1 => '32',
      2 => '84',
      3 => '95',
      4 => '109',
    ),
  ),
);
