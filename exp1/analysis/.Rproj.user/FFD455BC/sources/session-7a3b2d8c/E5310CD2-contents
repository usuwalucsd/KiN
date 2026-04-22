library(here)
library(tidyverse)
library(lme4)
library(lmerTest)

processed_data_directory <- here("..","data","processed_data")
file_name <- "mental_rotation"

processed_data <- read_csv(here(processed_data_directory,paste0(file_name,"-processed-data.csv")))  %>%
  #remove practice trials
  filter(trial_kind == "experimental")

#summarize memory accuracy by participant
subj_avg <- processed_data %>%
  filter(rt<10000) %>% #rather arbitrary cutoff for way-too-long RTs
  filter(!is.na(rt)) %>% #remove too slow trials
  mutate(is_right = ifelse(correct,1,0)) %>%
  group_by(participant_id,angle,correct_response) %>%
  summarize(
    N = n(),
    mean_acc = mean(is_right),
    mean_error_rate=mean(1-is_right),
    mean_rt = mean(rt[is_right==1])
  )

#overall accuracy
overall_acc_rt <- subj_avg %>%
  group_by(angle,correct_response) %>%
  summarize(
    N=n(),
    avg = mean(mean_acc),
    sd = sd(mean_acc),
    sem = sd / sqrt(N),
    avg_rt = mean(mean_rt),
    sd_rt = sd(mean_rt),
    sem_rt = sd_rt / sqrt(N),
    avg_error_rate=mean(mean_error_rate),
    sd_error_rate = sd(mean_error_rate),
    sem_error_rate = sd_error_rate / sqrt(N),
  )

#accuracy
ggplot(subj_avg,aes(angle,mean_acc))+
  geom_jitter(alpha=0.2,width=10)+
  geom_point(data=overall_acc_rt,aes(y=avg),size=2)+
  geom_errorbar(data=overall_acc_rt,aes(y=avg,ymin=avg-sem,ymax=avg+sem),width=0)+
  geom_smooth(method="lm")+
  facet_wrap(~correct_response)+
  theme_minimal()+
  ylab("Accuracy")

#error rate
ggplot(subj_avg,aes(angle,mean_error_rate))+
  geom_jitter(alpha=0.2,width=10)+
  geom_point(data=overall_acc_rt,aes(y=avg_error_rate),size=2)+
  geom_errorbar(data=overall_acc_rt,aes(y=avg,ymin=avg_error_rate-sem_error_rate,ymax=avg_error_rate+sem_error_rate),width=0)+
  geom_smooth(method="lm")+
  facet_wrap(~correct_response)+
  theme_bw(base_size=16)+
  ylab("Error Rate")

#reaction time
ggplot(subj_avg,aes(angle,mean_rt))+
  geom_jitter(alpha=0.2,width=10)+
  geom_point(data=overall_acc_rt,aes(y=avg_rt),size=2)+
  geom_errorbar(data=overall_acc_rt,aes(y=avg_rt,ymin=avg_rt-sem_rt,ymax=avg_rt+sem_rt),width=0)+
  geom_smooth(method="lm")+
  facet_wrap(~correct_response)+
  theme_bw(base_size=16)+
  ylab("Reaction Time (ms)")


processed_data <- processed_data %>%
  mutate(
    angle_c = (angle-mean(angle))/50
  )

m <- lmer(rt ~ 1 + angle_c+(1+angle_c|participant_id)+(1|object_num), data=filter(processed_data,correct_response=="same"&rt<10000&correct))
summary(m)

ggplot(filter(processed_data,correct_response=="same"&rt<10000&correct),aes(angle,rt,color=participant_id))+
  #geom_point()+
  geom_smooth(method="lm",se=F)+
  theme(legend.position="none")
