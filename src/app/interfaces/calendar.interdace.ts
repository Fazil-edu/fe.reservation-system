export const disabledDays: number[] = [0]; // [0]

const monthNames = [
  'Yanvar',
  'Fevral',
  'Mart',
  'Aprel',
  'May',
  'İyun',
  'İyul',
  'Avqust',
  'Sentyabr',
  'Oktyabr',
  'Noyabr',
  'Dekabr',
];

export const calendarConfig = {
  firstDayOfWeek: 1,
  dayNames: [
    'Bazar',
    'Bazar ertəsi',
    'Çərşənbə axşamı',
    'Çərşənbə',
    'Cümə axşamı',
    'Cümə',
    'Şənbə',
  ],
  dayNamesMin: ['Baz.', 'B.e.', 'Ç.a.', 'Çər.', 'C.a.', 'Cüm.', 'Şən.'],
  monthNamesShort: monthNames,
  monthNames: monthNames,
  today: 'Bu gün',
  clear: 'Təmizlə',
};
