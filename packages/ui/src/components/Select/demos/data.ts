export const sportsOptions = [
  { label: '⚽ Soccer', value: 'soccer' },
  { label: '🏀 Basketball', value: 'basketball' },
  { label: '🎾 Tennis', value: 'tennis' },
  { label: '🏈 Football', value: 'football' },
] as const

export const sportsOptionsWithDetails = [
  {
    label: '🏒 Hockey',
    value: 'hockey',
    description: 'Fast-paced ice sport with quick line changes.',
  },
  {
    label: '🏉 Rugby',
    value: 'rugby',
    description: 'Continuous play and shared possession battles.',
  },
  {
    label: '🏏 Cricket',
    value: 'cricket',
    description: 'Strategic innings with field placements and bowling styles.',
  },
  {
    label: '⚾ Baseball',
    value: 'baseball',
    description: 'Nine innings focused on pitching duels and hitting power.',
  },
] as const

export const sportsOptionsWithDisabled = [
  { label: '⚽ Soccer', value: 'soccer' },
  { label: '🏀 Basketball', value: 'basketball', disabled: true },
  { label: '⛳ Golf', value: 'golf' },
  { label: '🏓 Table Tennis', value: 'table-tennis' },
] as const
