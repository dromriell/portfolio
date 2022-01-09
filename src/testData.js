/**
 * Test Data
 */
export const worksData = [
  // TEST DATA
  {
    type: "app",
    name: "ace run",
    tech: ["react-native, django, drf, postgresql"],
    description:
      "A complete disc golf tracking experience connected to the PDGA API. Search for and add discs to your bag and track your shot history across thousands of courses.",
    privacy: "private",
    img: "static/Screenshot_1632242642.png",
  },
  {
    type: "combo",
    name: "ts dash",
    tech: ["react, react-native, django, drf, postgresql"],
    description:
      "An unofficial app/site to help Tile Shop employees track daily work tasks and design appointment.",
    privacy: "private",
    comboTypes: [
      {
        type: "site",
        img: "https://cdn.pixabay.com/photo/2017/03/10/10/07/bathroom-2132342_960_720.jpg",
      },
      {
        type: "app",
        img: "https://cdn.pixabay.com/photo/2017/06/22/16/56/fractal-2431532_960_720.jpg",
      },
    ],
    img: null,
  },
  {
    type: "site",
    name: "test site",
    tech: ["react, django-rest-framework, SQLite"],
    description:
      "A test website for making sure that the layouts here are flexible enough and display correctly. Needs to be replaced with an actual project when one is available.",
    img: "https://cdn.pixabay.com/photo/2015/10/29/14/38/web-1012467_960_720.jpg",
  },
];
