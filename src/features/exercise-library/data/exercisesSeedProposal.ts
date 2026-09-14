import type { Exercise } from '../../../lib/data/types';

// This is the live 40-exercise catalog: `seedExercises` in
// `src/lib/data/mockApi.ts` (owned by Agent 1 — also imported from there by
// `electron/ipc/persistence.ts` for the real, better-sqlite3-backed
// implementation) re-exports this array directly, so editing it here is
// what changes the catalog everywhere.
//
// The first 8 entries below are byte-for-byte the exercises originally
// seeded in `mockApi.ts` (same ids, unchanged), since `seedLogEntries()` in
// that file references their ids. The remaining ~32 were added by Agent 2
// (Exercise Library), bringing the catalog to 5 exercises per body part
// across all 8 `BodyPart` values. All instruction text was written from
// scratch for this app (see `../assets/LICENSE_NOTES.md`).
//
// This feature's own components (LibraryPage, ExercisePicker) don't import
// this file directly — they read exercises via `getApi().listExercises()`,
// per CONTRACTS.md — so they pick up whatever this array contains
// automatically.

function youtubeSearchUrl(name: string): string {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(`${name} exercise tutorial`)}`;
}

export const exercisesSeedProposal: Exercise[] = [
  // ── Chest ────────────────────────────────────────────────────────────
  {
    id: 'ex-barbell-bench-press',
    name: 'Barbell Bench Press',
    bodyPart: 'chest',
    secondaryMuscles: ['shoulders', 'triceps'],
    equipment: 'Barbell',
    instructions: [
      'Lie flat on a bench with feet planted on the floor.',
      'Grip the bar slightly wider than shoulder-width.',
      'Lower the bar to your chest, then press back up to full extension.',
    ],
    youtubeSearchUrl: youtubeSearchUrl('Barbell Bench Press'),
  },
  {
    id: 'ex-incline-dumbbell-press',
    name: 'Incline Dumbbell Press',
    bodyPart: 'chest',
    secondaryMuscles: ['shoulders', 'triceps'],
    equipment: 'Dumbbells, incline bench',
    instructions: [
      'Set a bench to a 30-45 degree incline and lie back with a dumbbell in each hand at shoulder height.',
      'Press both dumbbells up until your arms are extended, without locking the elbows.',
      'Lower slowly until you feel a stretch across the upper chest, then repeat.',
    ],
    youtubeSearchUrl: youtubeSearchUrl('Incline Dumbbell Press'),
  },
  {
    id: 'ex-push-up',
    name: 'Push-Up',
    bodyPart: 'chest',
    secondaryMuscles: ['shoulders', 'triceps', 'core'],
    equipment: 'Bodyweight',
    instructions: [
      'Start in a plank with hands slightly wider than shoulder-width.',
      'Lower your chest toward the floor, keeping your body in a straight line.',
      'Push back up to the starting position.',
    ],
    youtubeSearchUrl: youtubeSearchUrl('Push-Up'),
  },
  {
    id: 'ex-cable-chest-fly',
    name: 'Cable Chest Fly',
    bodyPart: 'chest',
    secondaryMuscles: ['shoulders'],
    equipment: 'Cable machine',
    instructions: [
      'Set both pulleys to shoulder height and grab a handle in each hand, stepping forward until arms are extended out to the sides.',
      'With a slight bend in the elbows, sweep your hands together in front of your chest.',
      'Return slowly to the starting position under control.',
    ],
    youtubeSearchUrl: youtubeSearchUrl('Cable Chest Fly'),
  },
  {
    id: 'ex-dips-chest',
    name: 'Chest Dip',
    bodyPart: 'chest',
    secondaryMuscles: ['shoulders', 'triceps'],
    equipment: 'Dip bars',
    instructions: [
      'Support yourself on parallel bars with arms extended, leaning your torso slightly forward.',
      'Lower your body by bending the elbows until you feel a stretch in the chest.',
      'Press back up to full extension.',
    ],
    youtubeSearchUrl: youtubeSearchUrl('Chest Dip'),
  },

  // ── Back ─────────────────────────────────────────────────────────────
  {
    id: 'ex-pull-up',
    name: 'Pull-Up',
    bodyPart: 'back',
    secondaryMuscles: ['biceps', 'shoulders'],
    equipment: 'Pull-up bar',
    instructions: [
      'Hang from the bar with an overhand grip, hands wider than shoulders.',
      'Pull yourself up until your chin clears the bar.',
      'Lower under control to a full hang.',
    ],
    youtubeSearchUrl: youtubeSearchUrl('Pull-Up'),
  },
  {
    id: 'ex-barbell-bent-over-row',
    name: 'Barbell Bent-Over Row',
    bodyPart: 'back',
    secondaryMuscles: ['biceps', 'shoulders'],
    equipment: 'Barbell',
    instructions: [
      'Hinge at the hips holding a barbell with an overhand grip, torso close to parallel with the floor.',
      'Pull the bar toward your lower ribs, squeezing your shoulder blades together.',
      'Lower back to a full stretch with control.',
    ],
    youtubeSearchUrl: youtubeSearchUrl('Barbell Bent-Over Row'),
  },
  {
    id: 'ex-lat-pulldown',
    name: 'Lat Pulldown',
    bodyPart: 'back',
    secondaryMuscles: ['biceps'],
    equipment: 'Cable machine',
    instructions: [
      'Sit at the lat pulldown station and grip the bar wider than shoulder-width.',
      'Pull the bar down to your upper chest, driving your elbows down and back.',
      'Let the bar rise back to full arm extension under control.',
    ],
    youtubeSearchUrl: youtubeSearchUrl('Lat Pulldown'),
  },
  {
    id: 'ex-seated-cable-row',
    name: 'Seated Cable Row',
    bodyPart: 'back',
    secondaryMuscles: ['biceps', 'shoulders'],
    equipment: 'Cable machine',
    instructions: [
      'Sit at the cable row station with knees slightly bent, gripping the handle with arms extended.',
      'Pull the handle to your torso, keeping your back straight and squeezing your shoulder blades together.',
      'Extend your arms back out under control.',
    ],
    youtubeSearchUrl: youtubeSearchUrl('Seated Cable Row'),
  },
  {
    id: 'ex-deadlift',
    name: 'Deadlift',
    bodyPart: 'back',
    secondaryMuscles: ['legs', 'core'],
    equipment: 'Barbell',
    instructions: [
      'Stand with feet hip-width apart, bar over mid-foot, and grip it just outside your legs.',
      'Keeping your back flat, drive through your heels and extend your hips and knees to stand up straight.',
      'Lower the bar back to the floor with control by hinging at the hips first.',
    ],
    youtubeSearchUrl: youtubeSearchUrl('Deadlift'),
  },

  // ── Shoulders ────────────────────────────────────────────────────────
  {
    id: 'ex-overhead-press',
    name: 'Overhead Press',
    bodyPart: 'shoulders',
    secondaryMuscles: ['triceps', 'core'],
    equipment: 'Barbell',
    instructions: [
      'Stand with the bar racked at shoulder height.',
      'Press the bar overhead until arms are fully extended.',
      'Lower back to shoulder height with control.',
    ],
    youtubeSearchUrl: youtubeSearchUrl('Overhead Press'),
  },
  {
    id: 'ex-lateral-raise',
    name: 'Dumbbell Lateral Raise',
    bodyPart: 'shoulders',
    equipment: 'Dumbbells',
    instructions: [
      'Stand holding a light dumbbell in each hand at your sides, palms facing in.',
      'Raise both arms out to the sides until they reach shoulder height, keeping a slight bend in the elbows.',
      'Lower back down slowly with control.',
    ],
    youtubeSearchUrl: youtubeSearchUrl('Dumbbell Lateral Raise'),
  },
  {
    id: 'ex-front-raise',
    name: 'Dumbbell Front Raise',
    bodyPart: 'shoulders',
    equipment: 'Dumbbells',
    instructions: [
      'Stand holding a dumbbell in each hand in front of your thighs.',
      'Raise one or both arms straight out in front of you to shoulder height.',
      'Lower back down with control and repeat.',
    ],
    youtubeSearchUrl: youtubeSearchUrl('Dumbbell Front Raise'),
  },
  {
    id: 'ex-face-pull',
    name: 'Face Pull',
    bodyPart: 'shoulders',
    secondaryMuscles: ['back'],
    equipment: 'Cable machine, rope attachment',
    instructions: [
      'Set a cable pulley to upper-chest height with a rope attachment and grip both ends.',
      'Pull the rope toward your face, flaring your elbows out wide and squeezing your shoulder blades together.',
      'Return to the starting position under control.',
    ],
    youtubeSearchUrl: youtubeSearchUrl('Face Pull'),
  },
  {
    id: 'ex-arnold-press',
    name: 'Arnold Press',
    bodyPart: 'shoulders',
    secondaryMuscles: ['triceps'],
    equipment: 'Dumbbells',
    instructions: [
      'Sit holding dumbbells in front of your shoulders with palms facing you.',
      'Press the dumbbells overhead while rotating your palms to face forward.',
      'Reverse the rotation as you lower back to the starting position.',
    ],
    youtubeSearchUrl: youtubeSearchUrl('Arnold Press'),
  },

  // ── Legs ─────────────────────────────────────────────────────────────
  {
    id: 'ex-back-squat',
    name: 'Back Squat',
    bodyPart: 'legs',
    secondaryMuscles: ['core', 'back'],
    equipment: 'Barbell',
    instructions: [
      'Rest the bar across your upper back.',
      'Bend knees and hips to lower until thighs are parallel to the floor.',
      'Drive through your heels to stand back up.',
    ],
    youtubeSearchUrl: youtubeSearchUrl('Back Squat'),
  },
  {
    id: 'ex-lunge',
    name: 'Walking Lunge',
    bodyPart: 'legs',
    secondaryMuscles: ['core'],
    equipment: 'Bodyweight or dumbbells',
    instructions: [
      'Stand tall and step forward with one leg, lowering your hips until both knees are bent near 90 degrees.',
      'Push through the front heel to bring the back leg forward into the next step.',
      'Continue alternating legs as you walk forward.',
    ],
    youtubeSearchUrl: youtubeSearchUrl('Walking Lunge'),
  },
  {
    id: 'ex-leg-press',
    name: 'Leg Press',
    bodyPart: 'legs',
    equipment: 'Leg press machine',
    instructions: [
      'Sit in the leg press machine with feet shoulder-width apart on the platform.',
      'Lower the platform by bending your knees toward your chest.',
      'Press through your heels to extend your legs without locking the knees.',
    ],
    youtubeSearchUrl: youtubeSearchUrl('Leg Press'),
  },
  {
    id: 'ex-romanian-deadlift',
    name: 'Romanian Deadlift',
    bodyPart: 'legs',
    secondaryMuscles: ['back', 'core'],
    equipment: 'Barbell',
    instructions: [
      'Hold a barbell in front of your thighs with a shoulder-width grip.',
      'Hinge at the hips, pushing them back and lowering the bar along your legs while keeping a slight knee bend.',
      'Drive your hips forward to return to standing.',
    ],
    youtubeSearchUrl: youtubeSearchUrl('Romanian Deadlift'),
  },
  {
    id: 'ex-calf-raise',
    name: 'Standing Calf Raise',
    bodyPart: 'legs',
    equipment: 'Bodyweight or calf raise machine',
    instructions: [
      'Stand with the balls of your feet on a raised platform, heels hanging off the edge.',
      'Rise up onto your toes as high as possible.',
      'Lower your heels back below the platform for a full stretch, then repeat.',
    ],
    youtubeSearchUrl: youtubeSearchUrl('Standing Calf Raise'),
  },

  // ── Arms ─────────────────────────────────────────────────────────────
  {
    id: 'ex-barbell-curl',
    name: 'Barbell Curl',
    bodyPart: 'arms',
    equipment: 'Barbell',
    instructions: [
      'Stand holding the bar with an underhand, shoulder-width grip.',
      'Curl the bar up toward your shoulders, keeping elbows still.',
      'Lower back down with control.',
    ],
    youtubeSearchUrl: youtubeSearchUrl('Barbell Curl'),
  },
  {
    id: 'ex-hammer-curl',
    name: 'Hammer Curl',
    bodyPart: 'arms',
    secondaryMuscles: ['forearms'],
    equipment: 'Dumbbells',
    instructions: [
      'Stand holding a dumbbell in each hand with palms facing your body.',
      'Curl both dumbbells up toward your shoulders, keeping your palms facing in throughout.',
      'Lower back down with control.',
    ],
    youtubeSearchUrl: youtubeSearchUrl('Hammer Curl'),
  },
  {
    id: 'ex-tricep-pushdown',
    name: 'Tricep Pushdown',
    bodyPart: 'arms',
    equipment: 'Cable machine',
    instructions: [
      'Stand at a cable machine with a bar or rope attachment set at chest height, elbows tucked at your sides.',
      'Extend your arms down until fully straight, keeping your elbows pinned in place.',
      'Let the attachment rise back up under control.',
    ],
    youtubeSearchUrl: youtubeSearchUrl('Tricep Pushdown'),
  },
  {
    id: 'ex-close-grip-bench-press',
    name: 'Close-Grip Bench Press',
    bodyPart: 'arms',
    secondaryMuscles: ['chest', 'shoulders'],
    equipment: 'Barbell',
    instructions: [
      'Lie on a bench and grip the bar with hands about shoulder-width apart.',
      'Lower the bar to your lower chest, keeping your elbows close to your body.',
      'Press back up to full extension.',
    ],
    youtubeSearchUrl: youtubeSearchUrl('Close-Grip Bench Press'),
  },
  {
    id: 'ex-skull-crusher',
    name: 'Lying Tricep Extension (Skull Crusher)',
    bodyPart: 'arms',
    equipment: 'Barbell or EZ bar',
    instructions: [
      'Lie on a bench holding a bar above your chest with arms extended.',
      'Bend your elbows to lower the bar toward your forehead, keeping your upper arms still.',
      'Extend your arms back to the starting position.',
    ],
    youtubeSearchUrl: youtubeSearchUrl('Lying Tricep Extension Skull Crusher'),
  },

  // ── Core ─────────────────────────────────────────────────────────────
  {
    id: 'ex-plank',
    name: 'Plank',
    bodyPart: 'core',
    instructions: [
      'Hold a push-up position on your forearms, body in a straight line.',
      'Brace your core and hold for time.',
    ],
    youtubeSearchUrl: youtubeSearchUrl('Plank'),
  },
  {
    id: 'ex-crunch',
    name: 'Crunch',
    bodyPart: 'core',
    equipment: 'Bodyweight',
    instructions: [
      'Lie on your back with knees bent and hands lightly supporting your head.',
      'Curl your shoulders up off the floor, contracting your abs.',
      'Lower back down with control and repeat.',
    ],
    youtubeSearchUrl: youtubeSearchUrl('Crunch'),
  },
  {
    id: 'ex-hanging-leg-raise',
    name: 'Hanging Leg Raise',
    bodyPart: 'core',
    equipment: 'Pull-up bar',
    instructions: [
      'Hang from a pull-up bar with arms fully extended.',
      'Raise your legs up in front of you until they are roughly parallel to the floor, keeping them straight or bent.',
      'Lower back down under control without swinging.',
    ],
    youtubeSearchUrl: youtubeSearchUrl('Hanging Leg Raise'),
  },
  {
    id: 'ex-russian-twist',
    name: 'Russian Twist',
    bodyPart: 'core',
    equipment: 'Bodyweight or weight plate',
    instructions: [
      'Sit on the floor with knees bent and lean back slightly, lifting your feet off the ground for a harder variation.',
      'Rotate your torso to tap the floor on one side, then the other, keeping your core braced.',
    ],
    youtubeSearchUrl: youtubeSearchUrl('Russian Twist'),
  },
  {
    id: 'ex-mountain-climber',
    name: 'Mountain Climber',
    bodyPart: 'core',
    secondaryMuscles: ['cardio'],
    equipment: 'Bodyweight',
    instructions: [
      'Start in a high plank position with hands under your shoulders.',
      'Drive one knee toward your chest, then quickly switch legs.',
      'Continue alternating at a controlled or fast pace, keeping your hips level.',
    ],
    youtubeSearchUrl: youtubeSearchUrl('Mountain Climber'),
  },

  // ── Cardio ───────────────────────────────────────────────────────────
  {
    id: 'ex-treadmill-run',
    name: 'Treadmill Run',
    bodyPart: 'cardio',
    equipment: 'Treadmill',
    instructions: ['Warm up with a brisk walk.', 'Run at a steady, sustainable pace.', 'Cool down by walking.'],
    youtubeSearchUrl: youtubeSearchUrl('Treadmill Run'),
  },
  {
    id: 'ex-jump-rope',
    name: 'Jump Rope',
    bodyPart: 'cardio',
    secondaryMuscles: ['legs'],
    equipment: 'Jump rope',
    instructions: [
      'Hold the rope handles at hip height and swing it overhead using your wrists.',
      'Jump just high enough to clear the rope as it passes under your feet.',
      'Keep a steady rhythm, landing softly on the balls of your feet.',
    ],
    youtubeSearchUrl: youtubeSearchUrl('Jump Rope'),
  },
  {
    id: 'ex-rowing-machine',
    name: 'Rowing Machine',
    bodyPart: 'cardio',
    secondaryMuscles: ['back', 'legs'],
    equipment: 'Rowing machine',
    instructions: [
      'Strap in and start with knees bent, arms extended, gripping the handle.',
      'Drive through your legs, then lean back slightly and pull the handle to your ribs.',
      'Reverse the motion smoothly to return to the starting position, and repeat at a steady pace.',
    ],
    youtubeSearchUrl: youtubeSearchUrl('Rowing Machine'),
  },
  {
    id: 'ex-stationary-bike',
    name: 'Stationary Bike',
    bodyPart: 'cardio',
    secondaryMuscles: ['legs'],
    equipment: 'Stationary bike',
    instructions: [
      'Adjust the seat height so your knee has a slight bend at full pedal extension.',
      'Pedal at a steady cadence for your target duration, adjusting resistance as needed.',
    ],
    youtubeSearchUrl: youtubeSearchUrl('Stationary Bike'),
  },
  {
    id: 'ex-stair-climber',
    name: 'Stair Climber',
    bodyPart: 'cardio',
    secondaryMuscles: ['legs'],
    equipment: 'Stair climber machine',
    instructions: [
      'Step onto the machine and set a comfortable stepping pace.',
      'Keep your torso upright and avoid leaning heavily on the handrails.',
      'Maintain a steady rhythm for your target duration.',
    ],
    youtubeSearchUrl: youtubeSearchUrl('Stair Climber'),
  },

  // ── Full Body ────────────────────────────────────────────────────────
  {
    id: 'ex-burpee',
    name: 'Burpee',
    bodyPart: 'full_body',
    instructions: [
      'From standing, drop into a squat and place hands on the floor.',
      'Kick feet back into a plank, then return them to the squat.',
      'Explode upward into a jump.',
    ],
    youtubeSearchUrl: youtubeSearchUrl('Burpee'),
  },
  {
    id: 'ex-kettlebell-swing',
    name: 'Kettlebell Swing',
    bodyPart: 'full_body',
    secondaryMuscles: ['back', 'legs', 'core'],
    equipment: 'Kettlebell',
    instructions: [
      'Stand with feet shoulder-width apart, kettlebell on the floor in front of you.',
      'Hinge at the hips to grip it, then swing it back between your legs.',
      'Drive your hips forward explosively to swing the kettlebell up to chest height, then let it fall back.',
    ],
    youtubeSearchUrl: youtubeSearchUrl('Kettlebell Swing'),
  },
  {
    id: 'ex-clean-and-press',
    name: 'Clean and Press',
    bodyPart: 'full_body',
    secondaryMuscles: ['shoulders', 'legs', 'back'],
    equipment: 'Barbell',
    instructions: [
      'Start with the bar on the floor, gripping it just outside your legs.',
      'Explosively pull the bar up, dropping under it to catch it at your shoulders (the clean).',
      'Press the bar overhead until your arms are fully extended, then lower it back to your shoulders and the floor.',
    ],
    youtubeSearchUrl: youtubeSearchUrl('Clean and Press'),
  },
  {
    id: 'ex-thruster',
    name: 'Thruster',
    bodyPart: 'full_body',
    secondaryMuscles: ['legs', 'shoulders', 'core'],
    equipment: 'Barbell or dumbbells',
    instructions: [
      'Hold the weight at shoulder height and drop into a full front squat.',
      'As you stand back up, use the momentum to press the weight overhead.',
      'Lower the weight back to your shoulders and repeat.',
    ],
    youtubeSearchUrl: youtubeSearchUrl('Thruster'),
  },
  {
    id: 'ex-battle-ropes',
    name: 'Battle Ropes',
    bodyPart: 'full_body',
    secondaryMuscles: ['shoulders', 'core', 'cardio'],
    equipment: 'Battle ropes',
    instructions: [
      'Stand with feet shoulder-width apart, holding one rope end in each hand, arms extended.',
      'Alternate raising and slamming each arm to send waves down the ropes.',
      'Keep your knees soft and core braced throughout.',
    ],
    youtubeSearchUrl: youtubeSearchUrl('Battle Ropes'),
  },
];
