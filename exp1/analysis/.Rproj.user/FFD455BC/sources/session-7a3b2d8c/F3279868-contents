library(here)
library(tidyverse)
library(jsonlite)

processed_data_directory <- here("..","data","processed_data")
file_name <- "mental_rotation"

#read experiment data
exp_data <- read_csv(here(processed_data_directory,paste0(file_name,"-alldata.csv")))

#extract json data
participant_ids <- exp_data %>% 
  select(random_id,response) %>%
  filter(str_detect(response,"participant_id")) %>%
  #extract response to participant_id
  mutate(json = map(response, ~ fromJSON(.) %>% as.data.frame())) %>%
  unnest(cols = c(json)) %>%
  #clean up participant ids
  mutate(
    participant_id = case_when(
      participant_id == "A18534325" ~ "moose",
      TRUE ~ trimws(tolower(participant_id))
    )
  ) %>%
  select(random_id,participant_id)

survey <- exp_data %>% 
  filter(trial_type == "survey-html-form") %>%
  mutate(json = map(response, ~ fromJSON(.) %>% as.data.frame())) %>% 
  unnest(json) %>%
  select(random_id,age:difficulties)

#join into exp_data
exp_data <- exp_data %>%
  left_join(participant_ids) %>%
  left_join(survey)

#double check that participant ids are unique
counts_by_random_id <- exp_data %>%
  group_by(random_id,participant_id) %>%
  count()
#output to track participants
write_csv(counts_by_random_id,here(processed_data_directory,paste0(file_name,"-participant-list.csv")))

#filter and select relevant data
processed_data <- exp_data %>%
  filter(!is.na(correct)) %>%
  select(random_id,participant_id,trial_type,trial_index,time_elapsed,rt:difficulties,-participant,-file_name) %>%
  #identify practice trials
  mutate(
    trial_kind = case_when(
      is.na(object_num) ~ "practice",
      TRUE ~ "experimental"
    )
  ) %>%
  group_by(participant_id,trial_kind) %>%
  mutate(
    trial_number=seq(n())
  ) %>%
  relocate(
    trial_number,.after="trial_index"
  ) %>%
  #make rt numeric
  mutate(
    rt=as.numeric(as.character(rt))
  )

#filter participant ids
filter_ids <- c()

processed_data <- processed_data %>%
  #fix some ids
  filter(!(participant_id %in% filter_ids))

#store processed and prepped data
write_csv(processed_data,here(processed_data_directory,paste0(file_name,"-processed-data.csv")))
