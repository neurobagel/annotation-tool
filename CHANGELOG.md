# v0.3.0 (Wed Aug 27 2025)

#### 💥 Breaking Changes

- [ENH] Encode column data type in output dictionary [#220](https://github.com/neurobagel/annotation-tool/pull/220) ([@surchs](https://github.com/surchs))
- [MNT] Removed hard-coded logic for `identifies` key [#197](https://github.com/neurobagel/annotation-tool/pull/197) ([@rmanaem](https://github.com/rmanaem))
- [ENH] Added `subject group` to the config and updated codebase [#186](https://github.com/neurobagel/annotation-tool/pull/186) ([@rmanaem](https://github.com/rmanaem))
- [ENH] Implemented logic to allow multi-column annotation based on config [#187](https://github.com/neurobagel/annotation-tool/pull/187) ([@rmanaem](https://github.com/rmanaem))

#### 🚀 Enhancements

- [ENH] Add App bar [#212](https://github.com/neurobagel/annotation-tool/pull/212) ([@surchs](https://github.com/surchs))
- [ENH] Releasing `subject group` and `identifies` breaking change [#213](https://github.com/neurobagel/annotation-tool/pull/213) ([@rmanaem](https://github.com/rmanaem) [@surchs](https://github.com/surchs))
- [MNT] Replaced pagination with scrolling in `Column Annotation` step [#198](https://github.com/neurobagel/annotation-tool/pull/198) ([@rmanaem](https://github.com/rmanaem) [@surchs](https://github.com/surchs))
- [MNT] Refactored `DescriptionEditor` component to auto-save [#201](https://github.com/neurobagel/annotation-tool/pull/201) ([@rmanaem](https://github.com/rmanaem))

#### 🐛 Bug Fixes

- [FIX] Updated `constants` to fetch from `configs` directory of communities [#206](https://github.com/neurobagel/annotation-tool/pull/206) ([@rmanaem](https://github.com/rmanaem))

#### Authors: 2

- Arman Jahanpour ([@rmanaem](https://github.com/rmanaem))
- Sebastian Urchs ([@surchs](https://github.com/surchs))

---

# v0.2.0 (Thu Jul 24 2025)

:tada: This release contains work from a new contributor! :tada:

Thank you, Alyssa Dai ([@alyssadai](https://github.com/alyssadai)), for all your work!

#### 💥 Breaking Changes

- [ENH] Implemented configurability logic [#168](https://github.com/neurobagel/annotation-tool/pull/168) ([@rmanaem](https://github.com/rmanaem))
- [ENH] Implemented feature complete value annotation [#130](https://github.com/neurobagel/annotation-tool/pull/130) ([@rmanaem](https://github.com/rmanaem))
- [ENH] Implemented `MultiColumnMeasure` flow [#113](https://github.com/neurobagel/annotation-tool/pull/113) ([@rmanaem](https://github.com/rmanaem))

#### 🚀 Enhancements

- 🔄 synced local '.github/dependabot.yml' with remote 'template_workflows/dependabot.yml' [#97](https://github.com/neurobagel/annotation-tool/pull/97) ([@neurobagel-bot[bot]](https://github.com/neurobagel-bot[bot]))

#### 🐛 Bug Fixes

- [FIX] Fixed the `Assessment Tool` identifier in default config [#156](https://github.com/neurobagel/annotation-tool/pull/156) ([@rmanaem](https://github.com/rmanaem))
- [FIX] Fixed the `undefined` label on back button to landing view [#127](https://github.com/neurobagel/annotation-tool/pull/127) ([@rmanaem](https://github.com/rmanaem))
- [FIX] Fixed the issue with shared state between Columns in `DescriptionEditor` of `Continuous` Component [#96](https://github.com/neurobagel/annotation-tool/pull/96) ([@rmanaem](https://github.com/rmanaem))

#### 🏠 Internal

- [MNT] Update data dictionary schema to CLI v0.6.0 [#172](https://github.com/neurobagel/annotation-tool/pull/172) ([@alyssadai](https://github.com/alyssadai) [@rmanaem](https://github.com/rmanaem))

####  🧪 Tests

- [MNT] Updated and added tests to cover newly added functionalitie [#153](https://github.com/neurobagel/annotation-tool/pull/153) ([@rmanaem](https://github.com/rmanaem))

#### Authors: 3

- [@neurobagel-bot[bot]](https://github.com/neurobagel-bot[bot])
- Alyssa Dai ([@alyssadai](https://github.com/alyssadai))
- Arman Jahanpour ([@rmanaem](https://github.com/rmanaem))

---

# v0.1.0 (Tue Mar 18 2025)

:tada: This release contains work from new contributors! :tada:

Thanks for all your work!

:heart: Arman Jahanpour ([@rmanaem](https://github.com/rmanaem))

:heart: Sebastian Urchs ([@surchs](https://github.com/surchs))

#### 💥 Breaking Changes

- [ENH] Implemented app skeleton [#36](https://github.com/neurobagel/annotation-tool/pull/36) ([@rmanaem](https://github.com/rmanaem))

#### 🚀 Enhancements

- [ENH] Implemented `Continuous` component and updated tests [#88](https://github.com/neurobagel/annotation-tool/pull/88) ([@rmanaem](https://github.com/rmanaem))
- [ENH] Implemented `Categorical` component [#84](https://github.com/neurobagel/annotation-tool/pull/84) ([@rmanaem](https://github.com/rmanaem))
- [ENH] Implemented the column navigation bar component for value annotation step [#78](https://github.com/neurobagel/annotation-tool/pull/78) ([@rmanaem](https://github.com/rmanaem))
- [ENH] Implemented stepper [#65](https://github.com/neurobagel/annotation-tool/pull/65) ([@rmanaem](https://github.com/rmanaem))
- [ENH] Implemented UI and logic for `Download` view [#61](https://github.com/neurobagel/annotation-tool/pull/61) ([@rmanaem](https://github.com/rmanaem))
- [ENH] Implemented `ColumnAnnotationCard` component [#59](https://github.com/neurobagel/annotation-tool/pull/59) ([@rmanaem](https://github.com/rmanaem))
- [ENH] Implemented upload data dictionary component [#50](https://github.com/neurobagel/annotation-tool/pull/50) ([@rmanaem](https://github.com/rmanaem))
- [ENH] Implemented a component for uploading and previewing the data table [#38](https://github.com/neurobagel/annotation-tool/pull/38) ([@rmanaem](https://github.com/rmanaem))
- Merge branch 'main' into repo-sync/workflows/default [#72](https://github.com/neurobagel/annotation-tool/pull/72) ([@surchs](https://github.com/surchs))
- 🔄 synced local '.github/workflows/build_docker_on_release.yml' with remote 'template_workflows/auto_release/build_docker_on_release.yml' [#72](https://github.com/neurobagel/annotation-tool/pull/72) ([@neurobagel-bot[bot]](https://github.com/neurobagel-bot[bot]))
- [ENH] Implemented error boundary for the app [#47](https://github.com/neurobagel/annotation-tool/pull/47) ([@rmanaem](https://github.com/rmanaem))
- [ENH] Implemented landing view [#37](https://github.com/neurobagel/annotation-tool/pull/37) ([@rmanaem](https://github.com/rmanaem))

#### 🏠 Internal

- [MNT] Updated e2e test to cover current app functionalities [#73](https://github.com/neurobagel/annotation-tool/pull/73) ([@rmanaem](https://github.com/rmanaem))
- [MNT] Replaced `Ramda` logic with `Immer` [#71](https://github.com/neurobagel/annotation-tool/pull/71) ([@rmanaem](https://github.com/rmanaem))
- [MNT] Set up devtools for zustand [#63](https://github.com/neurobagel/annotation-tool/pull/63) ([@rmanaem](https://github.com/rmanaem))
- [CI] Set up `deploy` workflow for GitHub pages [#52](https://github.com/neurobagel/annotation-tool/pull/52) ([@rmanaem](https://github.com/rmanaem))
- [MNT] Bumped to react 19 and set up repo [#22](https://github.com/neurobagel/annotation-tool/pull/22) ([@rmanaem](https://github.com/rmanaem))

#### ⚠️ Pushed to `main`

- Initial commit ([@rmanaem](https://github.com/rmanaem))

#### Authors: 3

- [@neurobagel-bot[bot]](https://github.com/neurobagel-bot[bot])
- Arman Jahanpour ([@rmanaem](https://github.com/rmanaem))
- Sebastian Urchs ([@surchs](https://github.com/surchs))
