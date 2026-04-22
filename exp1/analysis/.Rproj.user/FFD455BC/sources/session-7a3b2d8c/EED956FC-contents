library(here)
library(tidyverse)
library(jsonlite)

processed_data_directory <- here("..","data","processed_data")
file_name <- "mental_rotation"

#read experiment data
exp_data <- read_csv(here(processed_data_directory,paste0(file_name,"-alldata.csv")))

#extract json data
participant_ids <- exp_data %>% 
  filter(trial_type == "survey-text") %>%
  mutate(json = map(response, ~ fromJSON(.) %>% as.data.frame())) %>% 
  unnest(json) %>%
  select(random_id,participant_id)

vvq <- exp_data %>% 
  filter(trial_type == "survey-html-form"&trial_index==295) %>%
  mutate(json = map(response, ~ fromJSON(.) %>% as.data.frame())) %>% 
  unnest(json) %>%
  select(random_id,response_1:response_16)

demo <- exp_data %>% 
  filter(trial_type == "survey-html-form"&trial_index==296) %>%
  mutate(json = map(response, ~ fromJSON(.) %>% as.data.frame())) %>% 
  unnest(json) %>%
  select(random_id,age:knowledge_check)

#join into exp_data
exp_data <- exp_data %>%
  left_join(participant_ids) %>%
  left_join(vvq) %>%
  left_join(demo)

#double check that participant ids are unique
counts_by_random_id <- exp_data %>%
  group_by(random_id,participant_id) %>%
  count()
#output to track participants
write_csv(counts_by_random_id,here(processed_data_directory,paste0(file_name,"-participant-list.csv")))

#filter and select relevant data
processed_data <- exp_data %>%
  filter(task=="response") %>%
  select(participant_id, random_id,trial_index,time_elapsed,rt:knowledge_check,-file_name) %>%
  group_by(participant_id) %>%
  mutate(
    trial_number=seq(n())
  ) %>%
  relocate(
    trial_number,.after="trial_index"
  ) %>%
  #extract stimulus information
  mutate(
    clean_path = str_remove_all(stimulus, "stimuli/|\\.jpg"),  # Remove 'stimuli/' and '.jpg'
    parts = str_split(clean_path, "_"),  # Split by '_'
    part1 = map_chr(parts, 1),  # Extract the first part (or you could directly access using `str_extract`)
    part2 = map_chr(parts, 2),  # Extract the second part
    part3 = map_chr(parts, ~ ifelse(length(.x) >= 3, .x[3], NA)) # Safely extract the third part
  ) %>%
  mutate(
    object_id = part1,
    angle = part2,
    same_different = case_when(
      part3 == "R" ~ "different",
      is.na(part3) ~ "same"
    )
  ) %>%
  mutate(
    angle=as.numeric(as.character(angle))
  ) %>%
  relocate(
    object_id,.after="stimulus"
  ) %>%
  relocate(
    angle,.after="object_id"
  ) %>%
  relocate(
    same_different,.after="angle"
  ) %>%
  select(-c(clean_path:part3)) %>%
  mutate(
    is_right = ifelse(correct,1,0)
  ) %>%
  relocate(
    is_right,.after="correct"
  ) %>%
  #make rt numeric
  mutate(
    rt=as.numeric(as.character(rt))
  )

#filter participant ids
filter_ids <- c(
  "1","12","1234","a1","as","nm","p4","p6"
)

processed_data <- processed_data %>%
  mutate(participant_id = trimws(tolower(participant_id))) %>%
  #fix some ids
  mutate(
    participant_id = case_when(
      participant_id == "herson" ~ "heron",
      participant_id == "p73" ~ "giraffe",
      participant_id == "2341" ~ "porcupine",
      participant_id == "a17689315" ~ "rabbit",
      participant_id == "a17922543" ~ "llama",
      TRUE ~ participant_id
    )
  ) %>%
  filter(!(participant_id %in% filter_ids))

#store processed and prepped data
write_csv(processed_data,here(processed_data_directory,paste0(file_name,"-processed-data.csv")))
