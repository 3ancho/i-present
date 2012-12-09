#!/usr/bin/env python
import sys
from numpy import polyfit, poly1d, asarray
from matplotlib import pyplot

BENCHMARK = 1
TCPDUMP = 0
COLORS = ['b', 'g',  'r', 'c', 'm', 'y', 'k', 'w']

SHAPES = ['-', '--', '-.', ':', '.', ',', 'o', 'v', 
    '^', '<', '>', '1', '2', '3', '4', 's', 'p',
    '*', 'h', 'H', '+', 'x', 'D', 'd', '|', '_']

class ParseApp(object):
  """docstring for ParseApp"""
  def __init__(self, mode=TCPDUMP, filename=None):
    super(ParseApp, self).__init__()
    self.filename = filename
    self.f = open(filename, 'rb')
    
  def onclose(self):
    if self.f:
      self.f.close()

  def parse_tcpdump(self,line):
    ''' 11:25:43.227428 IP 74.125.133.189.443 > 67.194.197.7.49951: Flags [P.],
    seq 3125284279:3125284334, ack 3128986769, win 1002, options [nop,nop,TS
    val 1891393771 ecr 588995647], length 55  '''
   
    if not line[0].isdigit() or not line[1].isdigit():
      return False

    raw = line.split(" ")
    timestamp = raw[0] 
    p_len = raw[-1].strip() 
    if "443" in raw[2]:
      direction = 1
      # from host
    else:
      direction = 0
      # to host

    return timestamp, direction, p_len 

  def parse_bench(self,line):
    """ U: 2, MR/S: 3344, MS/S: 3344, MR/S/U: 1610, MS/S/U: 1610, CPU: 29.0,
    Mem: 0.3 
    """
    
    if line[0] != "U":
      return False

    raw = line.split(",")
    data_list = []
    for item in raw:
      if "." in item:
        data_list.append( float(item.split(":")[1]) )
      else:
        data_list.append( int(item.split(":")[1]) )

    return data_list

  def plot_data(self, data):
    if data['type'] == BENCHMARK:
      data = data['content'] 
      """[500, 10174, 10174, 20.1, 20.1, 64.2, 2.9]"""
      label = ["User", "Msg Rec / Sec", "Msg Send / Sec", 
      "Msg Rec / Sec / User", "Msg Send / Sec / User", "CPU %", "Mem %"]
      series = [[],[],[],[],[],[],[]]

      for entry in data:
        for i in range(7):
          series[i].append(entry[i])

      x = [i for i in range(len(data)) ]
#      for i, item in enumerate(series[1:]):
#        pyplot.plot(series[0], item, label=label[i+1])
      pyplot.plot(series[0], series[2], "mo", label=label[2])
      ref = [ i*(i+1) for i in series[0]]
      pyplot.plot(series[0], ref, "g-" )

      z = polyfit(series[0], series[2], 3)
      p = poly1d(z)

      pyplot.plot(series[0], p(series[0]), "b-")

    elif data['type'] == TCPDUMP:
      data = data['content'] 
      """ time, direction, len """
      label = ["timestamp", "direction", "packet length"]
      series = [[],[],[]]

      start_time = [ int(item) for item in data[0][0][:8].split(":") ]
      for entry in data:
        tmp = [ int(item) for item in  entry[0][:8].split(":") ]
        arr = asarray(tmp) - asarray(start_time)
        timestamp = arr[0] * 3600 + arr[1] * 60 + arr[2]
        series[0].append(timestamp)
        series[1].append(int(entry[1]))
        series[2].append(int(entry[2]))

      #pyplot.plot(series[0], series[2], "b", label=label[2] )
      pyplot.hist(series[2])

    #pyplot.legend()
    pyplot.show()


  def run(self):
    data = {'type':None, 'content':[]}
    f = self.f
    for line in f.readlines():
      if mode == TCPDUMP:
        data['type'] = TCPDUMP
        entry = self.parse_tcpdump(line)
        if not entry:
          continue
        else:
          data['content'].append(entry)

      elif mode == BENCHMARK:
        data['type'] = BENCHMARK
        entry = self.parse_bench(line)
        if not entry:
          continue
        else:
          data['content'].append(entry)


    for item in data['content']:
      print item

    self.plot_data(data)

    self.onclose()
  

if __name__ == '__main__':
  a = sys.argv[1:]
  if a[0][0] == "-":
    if a[0][1] == "b":
      mode = BENCHMARK 
    else:
      mode = TCPDUMP
  else:
    print "need option -b or -t"
    sys.exit(1)
  app = ParseApp(filename=a[1])
  app.run()

