import { n as useSelector } from "./@tanstack/react-form+[...].mjs";
//#region node_modules/@tanstack/react-store/dist/useStore.js
/**
* Deprecated alias for {@link useSelector}.
*
* @example
* ```tsx
* const count = useStore(counterStore, (state) => state.count)
* ```
*
* @deprecated Use `useSelector` instead.
*/
var useStore = (source, selector = (s) => s, compare) => useSelector(source, selector, { compare });
//#endregion
export { useStore as t };
