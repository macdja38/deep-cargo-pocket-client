import React from "react";
import PropTypes from "prop-types";
import {
  Box,
  Button,
  Checkbox,
  Code,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  Link,
  List,
  ListItem,
  Text,
  Stack
} from "@chakra-ui/core";
import { useForm } from "react-hook-form";

import { api } from "../../consts";

/**
 * Calculates array of urls from input string
 *
 * @param {string} string
 * @returns {string[]}
 */
function calculateURLs(string) {
  const match = string.match(/{(\d+)-(\d+)}/);
  let urls;
  if (!match) {
    urls = [string];
  } else {
    const smallNum = Number.parseInt(match[1], 10);
    const bigNum = Number.parseInt(match[2], 10);
    urls = [];
    for (let i = smallNum; i <= bigNum; i++) {
      urls.push(string.replace(/{\d+-\d+}/, i));
    }
  }
  return urls;
}

function makeRequest(endpoint, data) {
  return fetch(`${api}/${endpoint}`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  }).then(response => response.json());
}

function Form({ setResult }) {
  const { handleSubmit, errors, register, formState } = useForm();
  const [prediction, setPrediction] = React.useState("");

  const onURLChange = React.useCallback(
    e => {
      const [first, last] = calculateURLs(e.target.value);

      setPrediction(last ? `${first} - ${last}` : first);
    },
    [setPrediction]
  );

  const onSubmit = React.useCallback(
    values => {
      const { title, extraTags, url, chapterTag } = values;
      const urls = calculateURLs(url);

      const data = {
        urls,
        slowCheck: true
      };

      if (title) data.title = title;
      if (extraTags) data.tags = extraTags;
      if (chapterTag) data.tagCheck = true;

      return makeRequest("pocket/add", data).then(result => {
        setResult(result["action_results"]);
      });
    },
    [setResult]
  );

  return (
    <Stack
      as="form"
      p={[4, 4, 4, 16]}
      spacing={4}
      rounded
      border="grey"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Heading>Add Chapters to Pocket</Heading>
      <FormControl isInvalid={errors.title}>
        <FormLabel htmlFor="title">Title</FormLabel>
        <Input
          name="title"
          placeholder="Way of Choices"
          ref={register({
            required: "Please enter a title"
          })}
        />
        <FormErrorMessage>
          {errors.title && errors.title.message}
        </FormErrorMessage>
      </FormControl>

      <FormControl>
        <Checkbox defaultIsChecked name="chapterTag" ref={register()}>
          Use tag for chapter number
        </Checkbox>
      </FormControl>

      <FormControl>
        <FormLabel htmlFor="extraTags">Extra tags</FormLabel>
        <Input name="extraTags" placeholder="way-of-choices" ref={register()} />
      </FormControl>

      <FormControl isInvalid={errors.url}>
        <FormLabel htmlFor="url">Chapter URL</FormLabel>
        <Input
          name="url"
          placeholder="https://gravitytales.com/Novel/way-of-choices/ztj-chapter-{522-523}"
          aria-describedby="url-helper"
          onChange={onURLChange}
          ref={register({
            validate: maybeUrl => {
              try {
                new URL(maybeUrl);
                return true;
              } catch (e) {
                return "Please enter a valid URL";
              }
            }
          })}
        />
        <FormErrorMessage>{errors.url && errors.url.message}</FormErrorMessage>
        <FormHelperText id="url-helper">
          Input URL you wish to add to pocket, or a range of urls with the range
          denoted by <Code>{"{100-200}"}</Code>, for example:
          <Code>
            https://gravitytales.com/Novel/way-of-choices/ztj-chapter-
            {"{522-523}"}
          </Code>
        </FormHelperText>
      </FormControl>

      <Box>
        <Heading as="h2" size="lg">
          Prediction
        </Heading>
        <Text>{prediction || "Enter a URL above first"}</Text>
      </Box>

      <Box>
        <Button
          type="submit"
          mt={4}
          size="lg"
          variantColor="teal"
          isLoading={formState.isSubmitting}
          isFullWidth
        >
          Submit
        </Button>
      </Box>
    </Stack>
  );
}

Form.propTypes = {
  setResult: PropTypes.func.isRequired
};

function Result({ result }) {
  return (
    <Box py={4} px={[4, 4, 4, 16]}>
      <Heading>Result</Heading>
      {Array.isArray(result) && (
        <List>
          {result.map(r => (
            <ListItem
              key={r.item_id}
              p={4}
              my={2}
              borderWidth={1}
              borderColor="gray.100"
              rounded="md"
              _hover={{ borderColor: "gray.200" }}
            >
              <Flex justifyContent="space-between">
                <Box flexGrow="1" mr={4}>
                  <Text fontWeight="bold" fontSize="lg">
                    {r.title}
                  </Text>
                  <Divider />
                  <Text color="gray.700">{r.excerpt}</Text>
                </Box>
                <Flex
                  direction="column"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Link href={r.resolved_url} title="Resolved URL">
                    {r.resolved_url}
                  </Link>
                </Flex>
              </Flex>
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
}

export default function Panel() {
  const [result, setResult] = React.useState(false);

  return (
    <Box>
      <Form setResult={setResult} />
      {result && (
        <>
          <Divider />
          <Result result={result} />
        </>
      )}
    </Box>
  );
}
