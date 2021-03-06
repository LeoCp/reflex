import * as React from "react"
import {
  ThemeProvider,
  MDXProvider,
  MDXRenderer,
  useColorMode,
  CodeBlock,
  Layout,
  Icon,
  Link,
} from "@reflexjs/gatsby-theme-core"
import {
  Button,
  Container,
  Div,
  Flexbox,
  Section,
  Span,
} from "@reflexjs/components"
import presets from "./presets"
import { PresetSelector } from "./preset-selector"
import copy from "copy-to-clipboard"
import omit from "lodash.omit"
import { Wrapper } from "@reflexjs/gatsby-theme-block"
import { Styled } from "theme-ui"

export const Preview = ({
  component,
  libraryUrl,
  withWrapper = true,
  children,
}) => {
  const { body, code, ...props } = component
  const [preview, togglePreview] = React.useState(true)
  const [preset, setPreset] = React.useState(0)
  const [colorMode] = useColorMode()
  const { theme } = presets[preset]

  // Reverse the color mode for the preset theme.
  let previewTheme = theme
  if (colorMode === "dark" && theme.colors.modes?.dark) {
    previewTheme = {
      ...theme,
      initialColorMode: "dark",
      colors: {
        ...theme.colors.modes.dark,
        modes: {
          light: {
            ...omit(theme.colors, ["modes"]),
          },
        },
      },
    }
  }

  // Customize the MDX wrapper for block so that props can
  // be passed down.
  const blockMDXComponents = withWrapper
    ? {
        wrapper: Wrapper,
      }
    : null

  return (
    <Layout>
      <Section py="2|6">
        <Container>
          <Flexbox
            flexDirection={["column", "row"]}
            alignItems={["flex-start", "center"]}
            justifyContent="space-between"
            py="4"
          >
            <Link
              to={libraryUrl}
              d="inline-flex"
              alignItems="center"
              fontSize="md"
              color="text"
            >
              <Icon name="arrow-left" mr="2" size="18px" />
              Back to library
            </Link>

            <Flexbox w={["100%", "auto"]} mt={[4, 0]} justifyContent="flex-end">
              <Flexbox
                position="relative"
                d={preview ? "flex" : "none"}
                flex="1"
              >
                <Span
                  fontSize="sm"
                  position="absolute"
                  left="2"
                  lineHeight="none"
                  pointerEvents="none"
                >
                  Select a preset:
                </Span>
                <PresetSelector
                  fontSize="sm"
                  fontWeight="semibold"
                  backgroundSize="18px"
                  backgroundPosition="right 3px center"
                  hoverBg="muted"
                  py="2"
                  pl="30"
                  pr="6"
                  mr="4"
                  flex="1"
                  onChange={(value) => setPreset(value)}
                />
              </Flexbox>

              <Button
                fontSize="sm"
                p="2"
                bg="transparent"
                hoverBg="muted"
                onClick={() => togglePreview(!preview)}
              >
                {preview ? "Source" : "Preview"}
              </Button>

              <Flexbox borderLeftWidth="1px" ml="4" pl="3">
                <Button
                  variant="icon"
                  hoverColor="primary"
                  onClick={() => copy(code)}
                >
                  <Icon name="clipboard" />
                </Button>
              </Flexbox>
            </Flexbox>
          </Flexbox>
        </Container>

        {preview ? (
          <Container
            borderWidth="1px"
            px="0"
            boxShadow="null|null|null|lg"
            rounded="null|null|null|lg"
            maxW="null|null|null|1240px"
          >
            <Flexbox
              bg="muted"
              h="50px"
              py="4"
              px="4"
              d="none|none|none|flex"
              borderBottomWidth="1px"
            >
              <Link
                bg="border"
                size="4"
                rounded="full"
                to={libraryUrl}
                hoverBg="red"
              />
              <Span bg="border" size="4" rounded="full" ml="2" />
              <Span bg="border" size="4" rounded="full" ml="2" />
            </Flexbox>
            <ThemeProvider theme={previewTheme}>
              <Div id="preview-wrapper">
                <Styled.root>
                  <MDXProvider components={blockMDXComponents}>
                    <MDXRenderer {...props}>{body}</MDXRenderer>
                  </MDXProvider>
                </Styled.root>
              </Div>
            </ThemeProvider>
          </Container>
        ) : (
          <Container>
            <CodeBlock
              className="language-jsx"
              sx={{
                pre: {
                  mt: 0,
                },
              }}
            >
              {code}
            </CodeBlock>
          </Container>
        )}
      </Section>
      {children}
    </Layout>
  )
}
