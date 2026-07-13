declare module "*.css" {
	const css: { readonly [key: string]: string }
	export default css
}

declare module "@mdxeditor/editor/style.css"

declare global {
	interface Window {
		mermaid: {
			run: () => Promise<void>
			contentLoaded: () => void
		}
	}
}
