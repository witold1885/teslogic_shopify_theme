const iconModules: Record<string, any> = import.meta.glob('./*.svg', { eager: true })
const iconMap: Record<string, any> = Object.entries(iconModules).reduce((acc, [key, mod]) => ({
    ...acc,
    [key.replace('./', '').replace('.svg', '')]: mod.default
}), {})
export default iconMap
