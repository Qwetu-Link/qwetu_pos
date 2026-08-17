import * as Icons from 'lucide-react'

type IconName = keyof typeof Icons

type IconProps = {
  size?: number
  className?: string
}

export function icon(name: string, props: IconProps = {}) {
  const Component = Icons[name as IconName] as React.ComponentType<IconProps> | undefined

  return Component ? <Component {...props} /> : <Icons.Circle {...props} />
}
