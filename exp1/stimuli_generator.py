from random import shuffle, randint, random
import numpy as np

def stimuli_generator(condition, counterbalance, numblocks, numtestblocks):
    if condition==1:
        fullinfo = True
    else:
        fullinfo= False

    if condition==2:
        colorized = True
    else:
        colorized = False
    if condition==3:
        obscure = True
    else:
        obscure = False
    if condition==4:
        longhorizon = True
    else:
        longhorizon = False

    exp_definition = []
    ndim = 4
    nstim = 2 ** ndim
    #abstract stimulus labels
    stimnums = range(nstim)
    powers = [pow(2,i) for i in range(ndim)]
    # abstract values for each of dimensions
    stimset =  [[(num/place)%2 for place in powers] for num in stimnums]
    # stimulus good/bad values (0 bad, 1 good)
    stimtypes = [0 for _ in range(nstim/4)] + [1 for _ in range(nstim-nstim/4)]
    # stimulus payoffs
    ap_payoff = [1 if s==1 else -5 for s in stimtypes]
    # mapping of pysical stim images to abstract structure: there are
    # 6 meaningful permutations of dimensions (where first 2 dims are
    # relevant and last ttow aren't
    dimmapping = np.array([[0,1,2,3],
                      [0,2,1,3],
                      [0,3,1,2],
                      [1,2,3,0],
                      [1,3,0,2],
                      [2,3,0,1]])[counterbalance]
    # swap dims randomly to get all 24 possibilities
    if random() > 0.5:
        dimmapping[0], dimmapping[1] = dimmapping[1], dimmapping[0]
    if random() > 0.5:
        dimmapping[2], dimmapping[3] = dimmapping[3], dimmapping[2]
    # randomly choose whether to swap attribute values on each dim
    swaps = np.array([randint(0,1) for _ in range(4)])
    # for each stimulus, flip appropriate dimension values, then take
    # dimensions to relevant powers (based on pysical stim dims) and
    # sum to get pysical stim number
    physstims = [sum(np.multiply([pow(2,i) for i in dimmapping], abs(np.array(s)-swaps))) for s in stimset]

    colors = range(nstim)
    shuffle(colors)
    trialnum = 0
    
    trainblocks = numblocks - numtestblocks
    badtrainingstims = range(nstim/4) * trainblocks
    goodtrainingstims = range(nstim/4, nstim) * trainblocks
    shuffle(badtrainingstims)
    shuffle(goodtrainingstims)


    
    for b in range(numblocks):
        if obscure:
            obscuredstims = range(nstim)
            shuffle(obscuredstims)
            # obscure part of 4 out of every 16 stims
            obscuredstims = obscuredstims[0:4]

        if numblocks - b <= numtestblocks:
            test = True
        else:
            test = False
        blockcontents = []
        if test:
            stims = stimnums
        else:
            stims = []
            for _ in range(nstim/4):
                stims.append(badtrainingstims.pop())
            for _ in range(nstim - nstim/4):
                stims.append(goodtrainingstims.pop())
                
        for s in stims:
            if colorized and not test:
                color = colors[s]
            else:
                color = 16
            stim = {'block': b,
                    'stimnum': s,
                    'imagenum': physstims[s],
                    'category': stimtypes[s],
                    'condition': condition,
                    'counterbalance': counterbalance,
                    'fullinfo': fullinfo,
                    'obscure': obscure,
                    'colorized': colorized,
                    'longhorizon': longhorizon,
                    'ap_payoff': ap_payoff[s],
                    'av_payoff': 0,
                    'color': color,
                    'test': test,
                    'phase': 'experiment',
            }
            dimensionvals = stimset[s]
            for idx, d in enumerate(dimensionvals):
                stim['dim' + str(idx)] = d
            for idx, d in enumerate(swaps):
                stim['swapdim' + str(idx)] = d
            for idx, d in enumerate(dimmapping):
                stim['physdim' + str(idx)] = d
            if obscure and not test and (s in obscuredstims):
                num = randint(0,3)
                stim['obscureNum'] = num
                stim['obscureNumPhys'] = dimmapping[num] + 1
            else:
                stim['obscureNum'] = -1
                stim['obscureNumPhys'] = 0
            blockcontents.append(stim)
        # shuffle the stimuli such that the the first half of the
        # block always has exactly half the bad stimuli, to make the
        # distribution of bad stimuli more even
        badstim = blockcontents[:(len(blockcontents)/4)]
        goodstim = blockcontents[(len(blockcontents)/4):]
        shuffle(badstim)
        shuffle(goodstim)
        firsthalf = badstim[:(len(badstim)/2)] + goodstim[:(len(goodstim)/2)]
        secondhalf = badstim[(len(badstim)/2):] + goodstim[(len(goodstim)/2):]
        shuffle(firsthalf)
        shuffle(secondhalf)
        blockcontents = firsthalf + secondhalf
        for i in range(len(blockcontents)):
            blockcontents[i]['trial'] = trialnum
            trialnum += 1
        exp_definition.append(blockcontents)
    return exp_definition

