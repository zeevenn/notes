---
title: Style Props
date: 2024-03-07
icon: style
category:
  - chakra
tag:
  - frontend
  - atomic css
  - chakra
  - styled system
---

Style Props 是一种通过简单传递 `prop` 来改变组件样式的方法。它通过提供有用的速记方法来改变组件的样式，从而节省时间。

::: tip

完整 `prop` 别名见：[Chakra UI - Style Props](https://chakra-ui.com/docs/styled-system/style-props)。

类似 Tailwind 和 驼峰 CSS。

:::

## margin and padding

```jsx
import { Box } from "@chakra-ui/react"

// m={2} refers to the value of `theme.space[2]`
<Box m={2}>Tomato</Box>

// You can also use custom values
<Box maxW="960px" mx="auto" />

// sets margin `8px` on all viewports and `12px` from the first breakpoint and up
<Box m={[2, 3]} />
```

## color and background-color

```jsx
import { Box } from "@chakra-ui/react"

// picks up a nested color value using dot notation
// => `theme.colors.gray[50]`
<Box color='gray.50' />

// raw CSS color value
<Box color='#f00' />

// background colors
<Box bg='tomato' />

// verbose prop
<Box backgroundColor='tomato' />
```

## Gradient

```jsx
import { Box, Text } from "@chakra-ui/react"

// adding linear gradient and color transitions
<Box w="100%" h="200px" bgGradient="linear(to-t, green.200, pink.500)" />

// adding radial gradient and color transitions
<Box w="100%" h="200px" bgGradient="radial(gray.300, yellow.400, pink.200)" />

// adding the text gradient
<Text
  bgGradient="linear(to-l, #7928CA, #FF0080)"
  bgClip="text"
  fontSize="6xl"
  fontWeight="extrabold"
>
  Welcome to Chakra UI
</Text>
```

## Typography

```jsx
import { Text } from "@chakra-ui/react"

// font-size of `theme.fontSizes.md`
<Text fontSize="md" />

// font-size `32px`
<Text fontSize={32} />

// font-size `'2em'`
<Text fontSize='2em' />

// text-align `left` on all viewports and `center` from the first breakpoint and up
<Text textAlign={[ 'left', 'center' ]} />
```

## Layout, width and height

```jsx
import { Box } from "@chakra-ui/react"

// verbose
<Box width="100%" height={32} />

// shorthand
<Box w="100%" h="32px" />

// use theme sizing
<Box boxSize="sm" />

// width `256px`
<Box w={256} />

// width `'40px'`
<Box w='40px' />
```

## Display

```jsx
import { Box } from '@chakra-ui/react'

// hide the element on all viewports
<Box display='none' />

// hide the element by default, and show from 'md' up
<Box display={{ base: "none", md: "block" }} />

// shorthand
<Box hideBelow='md' />

// hide the element from 'md' up
<Box display={{ base: "block", md: "none" }} />

// shorthand
<Box hideFrom='md' />
```

## Flexbox

```jsx
import { Box, Flex } from "@chakra-ui/react"

// verbose
<Box display="flex" alignItems="center" justifyContent="space-between">
  Box with Flex props
</Box>

// shorthand using the `Flex` component
<Flex align="center" justify="center">
  Flex Container
</Flex>
```

## Grid Layout

```jsx
import { Box, Grid } from "@chakra-ui/react"

// verbose
<Box display="grid" gridGap={2} gridAutoFlow="row dense">
  Grid
</Box>

// shorthand using the `Grid` component
<Grid gap={2} autoFlow="row dense">
  Grid
</Grid>
```

## Background

```jsx
import { Box } from "@chakra-ui/react"

// verbose
<Box
  backgroundImage="url('/images/kyuubi.png')"
  backgroundPosition="center"
  backgroundRepeat="no-repeat"
/>

// shorthand
<Box
  bgImage="url('/images/gaara.png')"
  bgPosition="center"
  bgRepeat="no-repeat"
/>
```

## Border

```jsx
<Box border="1px" borderColor="gray.200">
  Card
</Box>
```

## Border Radius

```jsx
import { Button } from "@chakra-ui/react"

// This button will have no right borderRadius
<Button borderRightRadius="0">Button 1</Button>

// This button will have no left borderRadius*/
<Button borderLeftRadius="0">Button 2</Button>

// top left and top right radius will be `theme.radii.md` => 4px
<Button borderTopRadius="md">Button 2</Button>
```

## Position

```jsx
import { Box } from "@chakra-ui/react"

// verbose
<Box position="absolute">Cover</Box>

// shorthand
<Box pos="absolute">Cover</Box>
<Box pos="absolute" top="0" left="0">
  Absolute with top and left
</Box>
<Box pos="fixed" w="100%" zIndex={2}>
  Fixed with zIndex
</Box>
```

## Shadow

![Shadow](https://raw.githubusercontent.com/dribble-njr/typora-njr/master/img/20240307183600.png)

```jsx
<SimpleGrid
  bg="gray.50"
  columns={{ sm: 2, md: 4 }}
  spacing="8"
  p="10"
  textAlign="center"
  rounded="lg"
  color="gray.400"
>
  <Box boxShadow="xs" p="6" rounded="md" bg="white">
    xs
  </Box>
  <Box boxShadow="sm" p="6" rounded="md" bg="white">
    sm
  </Box>
  <Box boxShadow="base" p="6" rounded="md" bg="white">
    Base
  </Box>
  <Box boxShadow="md" p="6" rounded="md" bg="white">
    md
  </Box>
  <Box boxShadow="lg" p="6" rounded="md" bg="white">
    lg
  </Box>
  <Box boxShadow="xl" p="6" rounded="md" bg="white">
    xl
  </Box>
  <Box boxShadow="2xl" p="6" rounded="md" bg="white">
    2xl
  </Box>
  <Box boxShadow="dark-lg" p="6" rounded="md" bg="white">
    Dark lg
  </Box>
  <Box boxShadow="outline" p="6" rounded="md" bg="white">
    Outline
  </Box>
  <Box boxShadow="inner" p="6" rounded="md" bg="white">
    Inner
  </Box>
</SimpleGrid>
```

## Filter

![Filter](https://raw.githubusercontent.com/dribble-njr/typora-njr/master/img/20240307183703.png)

```jsx
function Filters() {
  const basicBoxStyles = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    boxSize: '250px',
    color: 'white',
    textShadow: '0 0 20px black',
    fontWeight: 'bold',
    fontSize: '20px',
    px: 4,
    background:
      'url(https://picsum.photos/id/1080/200/300) center/cover no-repeat'
  }
  return (
    <Flex flexWrap="wrap" gap="24px" justifyContent="space-evenly">
      {/* adding filter property to the element */}
      <Box sx={basicBoxStyles} filter="grayscale(80%)">
        Box with Filter
      </Box>
      {/* adding blur property to the element */}
      <Box sx={basicBoxStyles} filter="auto" blur="2px">
        Box with Blur
      </Box>
      {/* adding brightness property to the element */}
      <Box sx={basicBoxStyles} filter="auto" brightness="40%">
        Box with Brightness
      </Box>
    </Flex>
  )
}
```

## 伪类

```jsx
import { Button } from "@chakra-ui/react"

// :hover style
<Button
  colorScheme="teal"
  _hover={{
    background: "white",
    color: "teal.500",
  }}
>
  Hover me
</Button>

// apply :hover over parent element
<Box
  role="group"
>
  <Box
    _hover={{ fontWeight: 'semibold' }}
    _groupHover={{ color: 'tomato' }}
  >
  </Box>
</Box>

// add ::before pseudo element
// Note: the content value needs an extra set of quotes!
<Box
  _before={{ content: '"🙂"', display: 'inline-block', mr: '5px' }}
>
  A pseudo element
</Box>
```

## `as`

`as` prop 是所有组件中的一项功能，它允许您传递要呈现的 HTML 标记或组件。

例如，您正在使用一个 Button 组件，但需要将其转换为一个链接。您可以像这样组成一个和 Button：

```jsx
<Button as="a" target="_blank" variant="outline" href="https://chakra-ui.com">
  Hello
</Button>
```
