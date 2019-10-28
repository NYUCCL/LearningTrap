## Code to turn the original psiturk-produced data files
## into the cleaner data files shared on OSF.

library("dplyr")

data = read.csv('../data/exp_data_v1.6_raw.csv')
questiondata = read.csv('../data/questiondata_v1.6_raw.csv')
questiondata$condition = recode_factor(questiondata$condition, `0`='contingent', `1`='full_info')
data$condition = recode_factor(data$condition, `0`='contingent',`1`='full_info')


cheaters = questiondata %>%
    filter(penpaper=="yes") %>%
        .$uniqueid
length(cheaters)

loopers = questiondata %>%
    filter(instructionloops>2) %>%
        .$uniqueid
length(loopers)

questiondata$exclude = ((questiondata$uniqueid %in% cheaters) | (questiondata$uniqueid %in% loopers))

data$exclude = as.numeric((data$uniqueid %in% cheaters) | (data$uniqueid %in% loopers))

questiondata = questiondata %>%
  mutate(legs = as.logical(legs),
         body = as.logical(body),
         antennae = as.logical(antennae),
         wings = as.logical(wings)) %>%
  mutate(
    rightdimensions = (counterbalance==5 & legs & body & !antennae & !wings) |
           (counterbalance==3 & legs & antennae & !body & !wings) |
           (counterbalance==4 & legs & wings & !body & !antennae) |
           (counterbalance==1 & body & antennae & !legs & !wings) |
           (counterbalance==2 & body & wings & !antennae & !legs) |
           (counterbalance==0 & antennae & wings & !legs & !body),
    trapdimensions = (counterbalance==5 & ((!legs & body & !antennae & !wings) | (legs & !body & !antennae & !wings))) |
           (counterbalance==3 & (!legs & antennae & !body & !wings) | (legs & !antennae & !body & !wings)) |
           (counterbalance==4 & (!legs & wings & !body & !antennae) | (legs & !wings & !body & !antennae)) |
           (counterbalance==1 & (!body & antennae & !legs & !wings) | (body & !antennae & !legs & !wings)) |
           (counterbalance==2 & (!body & wings & !antennae & !legs) | (body & !wings & !antennae & !legs)) |
           (counterbalance==0 & (!antennae & wings & !legs & !body) | (antennae & !wings & !legs & !body))
         )

cols = sapply(questiondata, is.logical)
questiondata[,cols] = lapply(questiondata[,cols], as.numeric)
questiondata$uniqueid = as.numeric(questiondata$uniqueid)

questiondata$X = NULL

data$uniqueid = as.numeric(data$uniqueid)

data$X = NULL
data$color = NULL
data$colorized = NULL
data$obscure = NULL
data$obscureNum = NULL
data$obscureNumPhys = NULL
data$longhorizon = NULL
data$phase = NULL

write.csv(data, '../data/data_exp1.csv', row.names=FALSE)
write.csv(questiondata, '../data/questiondata_exp1.csv', row.names=FALSE)

## Experiment S1

data = read.csv('../data/exp_data_v2.8_raw.csv')
questiondata = read.csv('../data/questiondata_v2.8_raw.csv')
questiondata$condition = recode_factor(questiondata$condition, `0`='contingent', `1`='full_info', `2`='individuated', `3`='occluded')
data$condition = recode_factor(data$condition, `0`='contingent', `1`='full_info', `2`='individuated', `3`='occluded')

cheaters = questiondata %>%
    filter(penpaper=="yes") %>%
        .$uniqueid
length(cheaters)


loopers = questiondata %>%
    filter(instructionloops>2) %>%
        .$uniqueid
length(loopers)

questiondata$exclude = ((questiondata$uniqueid %in% cheaters) | (questiondata$uniqueid %in% loopers))

data$exclude = as.numeric((data$uniqueid %in% cheaters) | (data$uniqueid %in% loopers))

questiondata = questiondata %>%
  mutate(degree = as.logical(degree),
         pastposition = as.logical(pastposition),
         skill = as.logical(skill),
         pastemployer = as.logical(pastemployer)) %>%
  mutate(
    rightdimensions = (counterbalance==3 & degree & pastposition & !skill & !pastemployer) |
      (counterbalance==4 & degree & skill & !pastposition & !pastemployer) |
      (counterbalance==5 & degree & pastemployer & !pastposition & !skill) |
      (counterbalance==0 & pastposition & skill & !degree & !pastemployer) |
      (counterbalance==1 & pastposition & pastemployer & !skill & !degree) |
      (counterbalance==2 & skill & pastemployer & !degree & !pastposition),
    trapdimensions = (counterbalance==3 & (!degree & pastposition & !skill & !pastemployer) |
       (degree & !pastposition & !skill & !pastemployer)) |
      (counterbalance==4 & (!degree & skill & !pastposition & !pastemployer) |
       (degree & !skill & !pastposition & !pastemployer)) |
      (counterbalance==5 & (!degree & pastemployer & !pastposition & !skill) |
       (degree & !pastemployer & !pastposition & !skill)) |
      (counterbalance==0 & (!pastposition & skill & !degree & !pastemployer) |
       (pastposition & !skill & !degree & !pastemployer)) |
      (counterbalance==1 & (!pastposition & pastemployer & !skill & !degree) |
       (pastposition & !pastemployer & !skill & !degree)) |
      (counterbalance==2 & (!skill & pastemployer & !degree & !pastposition) |
       (skill & !pastemployer & !degree & !pastposition))
  )

cols = sapply(questiondata, is.logical)
questiondata[,cols] = lapply(questiondata[,cols], as.numeric)
questiondata$uniqueid = as.numeric(questiondata$uniqueid)

questiondata$X = NULL

data$uniqueid = as.numeric(data$uniqueid)

data$X = NULL
data$longhorizon = NULL
data$phase = NULL
data$physdimval0 = NULL
data$physdimval1 = NULL
data$physdimval2 = NULL
data$physdimval3 = NULL

write.csv(data, '../data/data_expS1.csv', row.names=FALSE)
write.csv(questiondata, '../data/questiondata_expS1.csv', row.names=FALSE)

## Experiment S2

data = read.csv('../data/exp_data_v3.1_raw.csv')
questiondata = read.csv('../data/questiondata_v3.1_raw.csv')
questiondata$condition = recode_factor(questiondata$condition, `0`='contingent', `1`='full_info', `2`='individuated', `3`='occluded', `4`='noisy')
data$condition = recode_factor(data$condition, `0`='contingent', `1`='full_info', `2`='individuated', `3`='occluded', `4`='noisy')

cheaters = questiondata %>%
    filter(penpaper=="yes") %>%
        .$uniqueid
length(cheaters)

loopers = questiondata %>%
    filter(instructionloops>2) %>%
        .$uniqueid
length(loopers)

questiondata$exclude = ((questiondata$uniqueid %in% cheaters) | (questiondata$uniqueid %in% loopers))

data$exclude = as.numeric((data$uniqueid %in% cheaters) | (data$uniqueid %in% loopers))

questiondata = questiondata %>%
  mutate(degree = as.logical(degree),
         pastposition = as.logical(pastposition),
         skill = as.logical(skill),
         pastemployer = as.logical(pastemployer)) %>%
  mutate(
    rightdimensions = (counterbalance==3 & degree & skill & !pastposition & !pastemployer) |
      (counterbalance==4 & degree & pastposition & !skill & !pastemployer) |
      (counterbalance==5 & degree & pastemployer & !skill & !pastposition) |
      (counterbalance==0 & skill & pastposition  & !degree & !pastemployer) |
      (counterbalance==1 & skill & pastemployer & !pastposition & !degree) |
      (counterbalance==2 & pastposition & pastemployer & !degree & !skill),
    trapdimensions = (counterbalance==3 & (!degree & skill & !pastposition & !pastemployer)
      | (degree & !skill & !pastposition & !pastemployer)) |
      (counterbalance==4 & (!degree & pastposition & !skill & !pastemployer)
        | (degree & !pastposition & !skill & !pastemployer)) |
      (counterbalance==5 & (!degree & pastemployer & !skill & !pastposition)
        | (degree & !pastemployer & !skill & !pastposition)) |
      (counterbalance==0 & (!skill & pastposition  & !degree & !pastemployer)
        | (skill & !pastposition  & !degree & !pastemployer)) |
      (counterbalance==1 & (!skill & pastemployer & !pastposition & !degree)
        | (skill & !pastemployer & !pastposition & !degree)) |
      (counterbalance==2 & (!pastposition & pastemployer & !degree & !skill)
        | (pastposition & !pastemployer & !degree & !skill)))

cols = sapply(questiondata, is.logical)
questiondata[,cols] = lapply(questiondata[,cols], as.numeric)
questiondata$uniqueid = as.numeric(questiondata$uniqueid)

questiondata$X = NULL

data$uniqueid = as.numeric(data$uniqueid)

data$X = NULL
data$longhorizon = NULL
data$phase = NULL
data$physdimval0 = NULL
data$physdimval1 = NULL
data$physdimval2 = NULL
data$physdimval3 = NULL

write.csv(data, '../data/data_expS2.csv', row.names=FALSE)
write.csv(questiondata, '../data/questiondata_expS2.csv', row.names=FALSE)

## Experiment 2

data = read.csv('../data/exp_data_v4.0_raw.csv')
questiondata = read.csv('../data/questiondata_v4.0_raw.csv')
questiondata$condition = recode_factor(questiondata$condition, `0`='contingent', `1`='full_info', `2`='individuated', `3`='occluded', `4`='noisy')
data$condition = recode_factor(data$condition, `0`='contingent', `1`='full_info', `2`='individuated', `3`='occluded', `4`='noisy')

cheaters = questiondata %>%
    filter(penpaper=="yes") %>%
        .$uniqueid
length(cheaters)

loopers = questiondata %>%
    filter(instructionloops>2) %>%
        .$uniqueid
length(loopers)

questiondata$exclude = ((questiondata$uniqueid %in% cheaters) | (questiondata$uniqueid %in% loopers))

data$exclude = as.numeric((data$uniqueid %in% cheaters) | (data$uniqueid %in% loopers))

questiondata = questiondata %>%
  mutate(degree = as.logical(degree),
         pastposition = as.logical(pastposition),
         skill = as.logical(skill),
         pastemployer = as.logical(pastemployer)) %>%
  mutate(
    rightdimensions = (counterbalance==3 & degree & skill & !pastposition & !pastemployer) |
      (counterbalance==4 & degree & pastposition & !skill & !pastemployer) |
      (counterbalance==5 & degree & pastemployer & !skill & !pastposition) |
      (counterbalance==0 & skill & pastposition  & !degree & !pastemployer) |
      (counterbalance==1 & skill & pastemployer & !pastposition & !degree) |
      (counterbalance==2 & pastposition & pastemployer & !degree & !skill),
    trapdimensions = (counterbalance==3 & (!degree & skill & !pastposition & !pastemployer)
      | (degree & !skill & !pastposition & !pastemployer)) |
      (counterbalance==4 & (!degree & pastposition & !skill & !pastemployer)
        | (degree & !pastposition & !skill & !pastemployer)) |
      (counterbalance==5 & (!degree & pastemployer & !skill & !pastposition)
        | (degree & !pastemployer & !skill & !pastposition)) |
      (counterbalance==0 & (!skill & pastposition  & !degree & !pastemployer)
        | (skill & !pastposition  & !degree & !pastemployer)) |
      (counterbalance==1 & (!skill & pastemployer & !pastposition & !degree)
        | (skill & !pastemployer & !pastposition & !degree)) |
      (counterbalance==2 & (!pastposition & pastemployer & !degree & !skill)
        | (pastposition & !pastemployer & !degree & !skill)))

cols = sapply(questiondata, is.logical)
questiondata[,cols] = lapply(questiondata[,cols], as.numeric)
questiondata$uniqueid = as.numeric(questiondata$uniqueid)

questiondata$X = NULL

data$uniqueid = as.numeric(data$uniqueid)

data$X = NULL
data$longhorizon = NULL
data$phase = NULL
data$physdimval0 = NULL
data$physdimval1 = NULL
data$physdimval2 = NULL
data$physdimval3 = NULL

write.csv(data, '../data/data_exp2.csv', row.names=FALSE)
write.csv(questiondata, '../data/questiondata_exp2.csv', row.names=FALSE)
