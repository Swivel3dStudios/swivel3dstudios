export const cardData = [
  {
    title: 'Analysis & Display',
    description: 'Digitizing the Real World. Capture intricate details through advanced scanning techniques.',
    imageUrl: '/public/images/hq720.jpg',
    menu: [
      { title: 'Configurator', nuScene: '/components/scenes/configurator.js' },
      { title: 'Billboard Annotation', nuScene:'/components/scenes/configurator2.js' }
    ]
  },
  {
    title: 'Animation',
    description: 'Crafting Stunning Visuals. Showcasing photorealistic imagery with perfect lighting and materials.',
    imageUrl: '/public/images/airbrush.jpg',
    scenePath: '/components/scenes/stubbs3D.js',
    menu: [
      { title: 'Curated Animation', nuScene:'/components/scenes/stubbs3D.js' },
      { title: 'Sequintial Animation', nuScene:'/components/scenes/stubbs3D.js' }
    ]
  },
  {
    title: 'Interactive',
    description: 'Engage with Technology. Explore dynamic, interactive models to enhance user experience.',
    imageUrl: '/public/images/hq720.jpg',
    menu: [
      { title: 'Runtime Cutting Plane Manipulation', nuScene:'/components/scenes/stubbs3D.js' },
      { title: 'Inverse Kinematics', nuScene:'/components/scenes/stubbs3D.js' }
    ]
  }
];